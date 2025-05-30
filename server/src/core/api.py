""" API endpoints for Monet Explorer """

import requests
import json

from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response

from eth_account import Account

from .models import *
from .serializers import *

from ethereum import utils


def checksum_encode(addr):  # Takes a 20-byte binary address as input
    o = ''
    v = utils.big_endian_to_int(utils.sha3(addr.hex()))
    for i, c in enumerate(addr.hex()):
        if c in '0123456789':
            o += c
        else:
            o += c.upper() if (v & (2**(255 - 4*i))) else c.lower()
    return '0x'+o


class NetworkListAPIHandler(generics.ListAPIView):
    """
    A ViewSet for listing Networks
    """

    queryset = Network.objects.all()
    serializer_class = NetworkSerializer


class ValidatorListAPIHandler(generics.ListAPIView):
    """
    A ViewSet for listing Validators
    """

    queryset = Validator.objects.all()
    serializer_class = ValidatorSerializer

    def get_queryset(self):
        """ Get query set to be listed by Response """
        queryset = Validator.objects.all()

        network = self.request.query_params.get('network', None)
        if network is not None:
            queryset = queryset.filter(network__name=network.lower())

        cns_round = self.request.query_params.get('round', None)
        if cns_round is not None:
            queryset = queryset.filter(history__consensus_round=cns_round)

        if not cns_round:
            latest_history = ValidatorHistory.objects.filter(network__name=network.lower()).order_by(
                '-consensus_round').first()

            if not latest_history:
                return Validator.objects.none()

            queryset = Validator.objects.filter(history=latest_history)

        return queryset


class InfoListAPIHandler(generics.ListAPIView):
    """
    A ViewSet for listing Info
    """

    queryset = Info.objects.all()
    serializer_class = InfoSerializer

    def get_queryset(self):
        """ Get query set to be listed by Response """

        queryset = Info.objects.all()
        network = self.request.query_params.get('network', None)

        if network is not None:
            queryset = queryset.filter(
                validator__network__name=network.lower())

        latest_history = ValidatorHistory.objects.filter(network__name=network.lower()).order_by(
            '-consensus_round').first()

        if not latest_history:
            return Info.objects.none()

        queryset = Info.objects.filter(validator__history=latest_history)

        return queryset


class BlockListAPIHandler(generics.ListAPIView):
    """
    A ViewSet for listing Blocks
    """

    queryset = Block.objects.order_by('-index')
    serializer_class = BlockSerializer

    # @method_decorator(cache_page(60*60*0.5))
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def get_queryset(self):
        """ Get query set to be listed by Response """

        queryset = Block.objects.order_by('-index')
        network = self.request.query_params.get('network', None)

        if network is not None:
            queryset = queryset.filter(network__name=network.lower())

        return queryset


class FaucetAPIHandler(generics.CreateAPIView):
    """
    Handles all faucet related api queries
    """

    permission_classes = []

    def post(self, request, *args, **kwargs):
        f_tx = FaucetTransaction.objects.create(
            address=request.data['address'],
            amount=100
        )

        # submit eth tx here.
        acc = Account.from_key(
            0x3b1118dfa90ae88a8cae0ae3ca4dc2f758e0dac0a510f6c743a3c5bf12e53973
        )

        to = request.data['address']

        if to.startswith('0x'):
            to = request.data['address'][2:]

        tx = dict(
            to=checksum_encode(bytes.fromhex(to)),
            value=100000000000000000000,
            chainId=1,
            gas=21000,
            gasPrice=30,
        )

        r = requests.get(
            'http://139.180.213.180:8080/account/' + acc.address)

        tx['nonce'] = r.json()['nonce']

        signed = acc.sign_transaction(tx)
        k = requests.post(
            'http://139.180.213.180:8080/rawtx',
            data=str(signed['rawTransaction'].hex())
        )

        return Response(k.json())


class ValidatorHistoryAPIHandler(generics.ListAPIView):
    """
    Handles all faucet related api queries
    """
    queryset = ValidatorHistory.objects.all()
    serializer_class = ValidatorHistorySerializer

    # @method_decorator(cache_page(60*60*0.5))
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def get_queryset(self):
        """ Get query set to be listed by Response """

        queryset = ValidatorHistory.objects.all()
        network = self.request.query_params.get('network', None)

        if network is not None:
            queryset = queryset.filter(
                network__name=network.lower()).order_by('-consensus_round')
        return queryset


class StatisticsAPIHandler(APIView):
    """ Statistics api handler """

    def get(self, request, *args, **kwargs):
        """ GET request handelr """
        res = dict(
            block_height=0,
            tx_count=0,
            int_tx_count=0,
        )

        network = self.request.query_params.get('network', None)

        if network:
            last_block = Block.objects.filter(
                network__name=network.lower()).order_by('-index').first()

            if last_block:
                res['block_height'] = last_block.index

            res['tx_count'] = Transaction.objects.filter(
                block__network__name=network.lower()).count()

            res['int_tx_count'] = InternalTransaction.objects.filter(
                block__network__name=network.lower()).count()

        return Response(res)


class TransactionAPIHandler(generics.ListAPIView):
    """ Statistics API handler """

    model = Transaction
    serializer_class = TransactionSerializer

    @method_decorator(cache_page(60))  
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def get_queryset(self):
        """ Get query set to be listed by Response """
        import logging
        logger = logging.getLogger(__name__)
        
        network = self.request.query_params.get('network', None)
        limit = int(self.request.query_params.get('limit', 20))
        offset = int(self.request.query_params.get('offset', 0))
        
        queryset = Transaction.objects.select_related('block__network')
        
        if network is not None:
            queryset = queryset.filter(
                block__network__name=network.lower()
            ).order_by('-id')[:200]
        # delay one, sync block index.
        queryset = queryset[offset:offset + limit]
            
        return queryset


class WhitelistAPIHandler(APIView):
    """ Whitelist api handler """

    def get(self, request, *args, **kwargs):
        """ GET request handelr """
        network = self.request.query_params.get('network', None)

        if not network:
            return Response(dict(error="No network specified"))

        if not Network.objects.filter(name=network.lower()).count():
            return Response(dict(error="Network does not exist"))

        model = Network.objects.get(name=network.lower())

        return Response(json.loads(model.whitelist))


class NomineesAPIHandler(APIView):
    """ Nominees api handler """

    def get(self, request, *args, **kwargs):
        """ GET request handelr """
        network = self.request.query_params.get('network', None)

        if not network:
            return Response(dict(error="No network specified"))

        if not Network.objects.filter(name=network.lower()).count():
            return Response(dict(error="Network does not exist"))

        model = Network.objects.get(name=network.lower())

        return Response(json.loads(model.nominees))


class AddressAPIHandler(APIView):
    """ Nominees api handler """

    def get(self, request, address, *args, **kwargs):
        """ GET request handler """

        network = self.request.query_params.get('network', None)

        if not network:
            return Response(dict(error="No network specified"))

        if not Network.objects.filter(name=network.lower()).count():
            return Response(dict(error="Network does not exist"))

        model = Network.objects.get(name=network.lower())

        data = requests.get(
            f'http://{model.host}:{model.port}/account/' + address).json()

        return Response(data)
