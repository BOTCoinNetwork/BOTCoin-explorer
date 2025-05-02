"""
Core models serializers
"""

from rest_framework.serializers import ModelSerializer

from .models import (
    Network, Validator, Info, Block, Transaction,
    InternalTransaction, InternalTransactionReceipt, Signature,
    ValidatorHistory, Version
)


class NetworkSerializer(ModelSerializer):
    """ Network model serializer  """

    class Meta:
        model = Network
        fields = ['name', 'host', 'port', 'whitelist', 'nominees', 'evictees']


class VersionSerializer(ModelSerializer):
    """ Version model serializer  """

    class Meta:
        model = Version
        fields = ['id', 'babble', 'monetd', 'solc', 'evm_lite', 'solc_os']


class ValidatorHistorySerializer(ModelSerializer):
    """ Validator model serializer """

    class Meta:
        model = ValidatorHistory
        fields = ['consensus_round']

    def to_representation(self, instance):
        return dict(
            consensus_round=instance.consensus_round,
            validators=ValidatorSerializer(
                instance.validators,
                many=True
            ).data,
        )


class ValidatorSerializer(ModelSerializer):
    """ Validator model serializer """

    class Meta:
        model = Validator
        fields = ['moniker', 'host', 'public_key', 'reachable']

    def to_representation(self, instance):
        json = super().to_representation(instance)

        json['info'] = InfoSerializer(instance.info).data
        json['version'] = VersionSerializer(instance.version).data

        return json


class InfoSerializer(ModelSerializer):
    """ Info model serializer """

    class Meta:
        model = Info
        fields = [
            'e_id', 'type', 'state', 'consensus_events',
            'consensus_transactions', 'last_block_index',
            'last_consensus_round', 'last_peer_change',
            'min_gas_price', 'num_peers', 'undetermined_events',
            'transaction_pool', 'sync_rate', 'events_per_second',
            'rounds_per_second',
        ]


class BlockSerializer(ModelSerializer):
    """ Block model serializer """

    class Meta:
        model = Block
        fields = ['index', 'round_received',
                  'state_hash', 'peers_hash', 'frame_hash']

    def to_representation(self, instance):
        return {
            'index': instance.index,
            'round_received': instance.round_received,
            'state_hash': instance.state_hash,
            'peers_hash': instance.peers_hash,
            'frame_hash': instance.frame_hash,
            'network': NetworkSerializer(instance.network).data,
            'transactions': TransactionSerializer(instance.transactions, many=True).data,
            'internal_transactions': InternalTransactionSerializer(instance.internal_transactions, many=True).data,
            'internal_transaction_receipts': InternalTransactionReceiptSerializer(instance.internal_transaction_receipts, many=True).data,
            'signatures': SignatureSerializer(instance.signature, many=True).data,
        }


class TransactionSerializer(ModelSerializer):
    """ Transaction model serializer """

    class Meta:
        model = Transaction
        fields = ['data', 'block_id', 'sender', 'to', 'amount',
                  'gas', 'gas_price', 'nonce', 'payload', 'tx_hash']


class InternalTransactionSerializer(ModelSerializer):
    """ Internal Transaction model serializer """

    class Meta:
        model = InternalTransaction
        fields = ['data']


class InternalTransactionReceiptSerializer(ModelSerializer):
    """ Internal Transaction Receipt model serializer """

    class Meta:
        model = InternalTransactionReceipt
        fields = ['data']


class SignatureSerializer(ModelSerializer):
    """ Siganture model serializer """

    validator = ValidatorSerializer()

    class Meta:
        model = Signature
        fields = ['signature', 'validator']
