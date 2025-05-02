""" Extractor class - pulls required data from a monet node

botcoin: 0.3.3
"""

import json
import requests
import base64

from rlp import decode
from ethereum import transactions

from core.models import *


poa_api = "139.180.213.180"


class Extractor:
    """
    Extractor is the core class to pull data from a Monet node to the database
    """

    def __init__(self):
        pass

    def run(self):
        """ Run extractor """
        self.extract_validator_history()
        self.extract_validator_info()
        self.extract_blocks()
        # self.extract_poa()

    def extract_poa(self):
        """ Pulls all required POA data """

        for network in self.__get_networks():

            # Whitelist
            whitelist = self.__get(
                path=f'http://{poa_api}:5000/api/whitelist/?host={network.host}&port={network.port}', timeout=20)

            # Nominees
            nominees = self.__get(
                path=f'http://{poa_api}:5000/api/nominees/?host={network.host}&port={network.port}', timeout=20)

            network.whitelist = json.dumps(whitelist)
            network.nominees = json.dumps(nominees)

            network.save()

    def extract_blocks(self):
        """ Pulls all blocks from the node """
        import logging
        logger = logging.getLogger(__name__)

        for network in self.__get_networks():

            last_saved_block = Block.objects.filter(
                network=network).order_by('-index').first()

            info = requests.get(
                url=f'http://{network.host}:{network.port}/info').json()

            start = 0
            end = int(info['last_block_index'])

            if last_saved_block:
                start = last_saved_block.index - 20

            if start < 0:
                start = 0

            while start <= end:
                print("[-] Fetching blocks ", start, "/", end)

                new_blocks = requests.get(
                    url=f'http://{network.host}:8080/blocks/{start}?count=50').json()

                for block in new_blocks:
                    m_block, _ = Block.objects.get_or_create(
                        index=block['Body']['Index'],
                        network=network,
                        defaults={
                            "round_received": block['Body']['RoundReceived'],
                            "state_hash": block['Body']['StateHash'],
                            "peers_hash": block['Body']['PeersHash'],
                            "frame_hash": block['Body']['FrameHash']
                        }
                    )

                    history = ValidatorHistory.objects.filter(
                        consensus_round__lte=m_block.round_received,
                        network=network
                    ).order_by('-consensus_round').first()

                    # print("History: ", history.consensus_round, " - Block: ",
                    #       m_block.index, " @ ", m_block.round_received)

                    for tx_string in block['Body']['Transactions']:
                        b64_raw_tx = tx_string
                        raw_tx = base64.b64decode(b64_raw_tx)

                        tx_obj = decode(raw_tx, transactions.Transaction)
                        
                        gas_price = min(gas_price, 9223372036854775807)  
                        
                        value = tx_obj.value 
                        
                        tx = dict(
                            sender=tx_obj.sender.hex(),
                            to=tx_obj.to.hex(),
                            value=value,
                            data=tx_obj.data.hex(),
                            gas=tx_obj.startgas,
                            gas_price=gas_price,
                            nonce=tx_obj.nonce,
                            tx_hash="0x"+tx_obj.hash.hex()
                        )
                        
                        try:
                            _, _ = Transaction.objects.get_or_create(
                                block=m_block,
                                data=tx_string,
                                defaults={
                                    "sender": tx['sender'],
                                    "to": tx['to'],
                                    "amount": tx['value'],
                                    "gas": tx['gas'],
                                    "gas_price": tx['gas_price'],
                                    "nonce": tx['nonce'],
                                    "payload": tx['data'],
                                    "tx_hash": tx['tx_hash']
                                }
                            )
                        except Exception as e:
                            logger.error(f"处理交易失败: {str(e)}", exc_info=True)
                            continue
                            
                    for itx_string in block['Body']['InternalTransactions']:
                        _, _ = InternalTransaction.objects.get_or_create(
                            block=m_block,
                            data=itx_string
                        )

                    for itxr_string in block['Body']['InternalTransactionReceipts']:
                        _, _ = InternalTransactionReceipt.objects.get_or_create(
                            block=m_block,
                            data=itxr_string
                        )

                    for pub_key, sig in block['Signatures'].items():
                        if not history:
                            print("[x] Something went wrong")
                            return

                        validator = Validator.objects.get(
                            public_key=pub_key, history=history)

                        _, _ = Signature.objects.get_or_create(
                            block=m_block,
                            validator=validator,
                            signature=sig
                        )

                start = start + 50

    def extract_validator_history(self):
        """ Pulls any new validator changes from the node """

        for network in self.__get_networks():
            history = self.__get(
                path=f'http://{network.host}:{network.port}/history')

            if len(history) == ValidatorHistory.objects.filter(network=network).count():
                print("[-] Validator history is up to date")
                return

            for cns_rnd, validators in history.items():
                print(
                    f'[-] Network {network.name}@{cns_rnd} - {len(validators)}')

                history, _ = ValidatorHistory.objects.get_or_create(
                    network=network,
                    consensus_round=cns_rnd,
                )

                for validator in validators:
                    splitted = validator['NetAddr'].split(':')

                    host = splitted[0]
                    port = splitted[1]
                    public_key = validator['PubKeyHex']
                    moniker = validator['Moniker']

                    print(f'[-] Create/Save Validator {moniker}@{cns_rnd}')

                    v_model, created = Validator.objects.get_or_create(
                        public_key=public_key,
                        network=network,
                        history=history,
                        defaults={
                            "host": host,
                            "port": port,
                            "moniker": moniker,
                        })

                    if not created:
                        v_model.host = host
                        v_model.port = port
                        v_model.public_key = public_key

                        v_model.save()

    def extract_validator_info(self):
        """ Fetch info for current validator set for network """
        import logging
        logger = logging.getLogger(__name__)

        for network in self.__get_networks():
            history = ValidatorHistory.objects.filter(
                network=network).order_by('-consensus_round').first()

            if not history:
                logger.warning("Could not find latest history")
                return

            for validator in Validator.objects.filter(history=history, network=network):

                try:
                    info = self.__get(
                        path=f'http://{validator.host}:8080/info')

                    last_cns_round = info['last_consensus_round']
                    if info['last_consensus_round'] == "nil":
                        last_cns_round = 0

                    try:
                        min_gas_price = int(info['min_gas_price'])
                        min_gas_price = min(min_gas_price, 9223372036854775807)  # min BIGINT 
                    except (ValueError, TypeError):
                        min_gas_price = 0
                        logger.warning(f"err min_gas_price : {info['min_gas_price']}, 使用默认值 0")

                    info_model, created = Info.objects.get_or_create(
                        validator=validator,
                        defaults={
                            "e_id": info['id'],
                            "type": info['type'],
                            "state": info['state'],
                            "consensus_events": info['consensus_events'],
                            "consensus_transactions": info['consensus_transactions'],
                            "last_block_index": info['last_block_index'],
                            "last_consensus_round": last_cns_round,
                            "last_peer_change": info['last_peer_change'],
                            "min_gas_price": min_gas_price,
                            "num_peers": info['num_peers'],
                            "undetermined_events": info['undetermined_events'],
                            "sync_rate": info['sync_rate'],
                            "transaction_pool": info['transaction_pool'],
                            "rounds_per_second": info['rounds_per_second'],
                            "events_per_second": info['events_per_second'],
                        })

                    if not created:
                        old_values = {
                            'e_id': info_model.e_id,
                            'type': info_model.type,
                            'state': info_model.state,
                            'consensus_events': info_model.consensus_events,
                            'last_block_index': info_model.last_block_index,
                            # ... other
                        }
                        
                        info_model.e_id = info['id']
                        info_model.type = info['type']
                        info_model.state = info['state']
                        info_model.consensus_events = int(info['consensus_events'])
                        info_model.consensus_transactions = int(info['consensus_transactions'])
                        info_model.last_block_index = int(info['last_block_index'])
                        info_model.last_consensus_round = last_cns_round
                        info_model.last_peer_change = int(info['last_peer_change'])
                        info_model.min_gas_price = min_gas_price
                        info_model.num_peers = int(info['num_peers'])
                        info_model.undetermined_events = int(info['undetermined_events'])
                        info_model.sync_rate = info['sync_rate']
                        info_model.transaction_pool = int(info['transaction_pool'])
                        info_model.rounds_per_second = info['rounds_per_second']
                        info_model.events_per_second = info['events_per_second']

                        try:
                            info_model.save()
                            
                        except Exception as save_err:
                            logger.error(f'Info save err: {str(save_err)}', exc_info=True)

                    validator.reachable = True
                    validator.save()

                except Exception as err:
                    logger.error(f'get validator err: {str(err)}', exc_info=True)
                    validator.reachable = False
                    validator.save()
                    logger.warning(f'not conneted validator {validator.moniker} - {validator.host}:8080')

                self.__fetch_version(validator)

    def __get_networks(self):
        """ Returns list of active network """
        return Network.objects.filter(active=True)

    def __get(self, *, path, timeout=5):
        return requests.get(url=path, timeout=timeout).json()

    def __fetch_version(self, validator):
        version_info = self.__get(
            path=f'http://{validator.host}:8080/version')

        version_model, created = Version.objects.get_or_create(validator=validator, defaults={
            "monetd": version_info['botcoin'],
            "evm_lite": version_info['evm-lite'],
            "babble": version_info['babble'],
            "solc": version_info['solc'],
            "solc_os": version_info['solc-os'],
        })

        if not created:
            version_model.monetd = version_info['botcoin']
            version_model.babble = version_info['babble']
            version_model.evm_lite = version_info['evm-lite']
            version_model.solc = version_info['solc']
            version_model.solc_os = version_info['solc-os']

        version_model.save()


def run():
    """ Initialize and run extractor """
    import logging
    import os
    # Get the parent directory (server directory)
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    log_dir = os.path.join(base_dir, 'logs')
    
    # Ensure logs directory exists
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)
        
    logging.basicConfig(
        filename=os.path.join(log_dir, 'cron.log'),
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s'
    )
    
    try:
        logger = logging.getLogger(__name__)
        extractor = Extractor()
        extractor.extract_validator_history()
        extractor.extract_validator_info()
        extractor.extract_blocks()
    except Exception as e:
        logging.error(f"Scheduled task failed: {str(e)}", exc_info=True)

def extract_blocks(self):
    """ Pulls all blocks from the node """
    
    for network in self.__get_networks():
        try:
            logger.info(f"Processing blocks for network: {network.name}")
            
            last_saved_block = Block.objects.filter(
                network=network).order_by('-index').first()
            
            logger.info(f"Last saved block index: {last_saved_block.index if last_saved_block else 'None'}")
            
            # Log pre-request information
            logger.info(f"Requesting network info: http://{network.host}:{network.port}/info")
            try:
                info = requests.get(
                    url=f'http://{network.host}:{network.port}/info').json()
                logger.info(f"Successfully retrieved network info: {json.dumps(info, indent=2)}")
            except Exception as e:
                logger.error(f"Failed to get network info: {str(e)}", exc_info=True)
                continue

            start = 0
            end = int(info['last_block_index'])
            
            if last_saved_block:
                start = last_saved_block.index - 20
            
            if start < 0:
                start = 0
                
            logger.info(f"Starting block sync, range: {start} - {end}")

            while start <= end:
                try:
                    logger.info(f"Fetching blocks {start}//{end}")
                    block_url = f'http://{network.host}:8080/blocks/{start}?count=50'
                    logger.info(f"Request URL: {block_url}")
                    
                    new_blocks = requests.get(url=block_url).json()
                    logger.info(f"Successfully retrieved {len(new_blocks)} blocks")
                    
                    for block in new_blocks:
                        block_index = block['Body']['Index']
                        logger.info(f"Processing block {block_index}")
                        # ... existing code ...
                        start = start + 50
                except Exception as e:
                    logger.error(f"Failed to process blocks {start}-{start+50}: {str(e)}", exc_info=True)
                    start = start + 50  # Continue with next batch even if current fails
                    
        except Exception as e:
            logger.error(f"Failed to process network {network.name}: {str(e)}", exc_info=True)
