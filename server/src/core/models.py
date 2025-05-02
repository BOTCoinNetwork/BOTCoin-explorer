""" Core models for Monet Explorer """
import datetime

from django.utils.timezone import now

from django.db import models


class Network(models.Model):
    """ Network model """

    class Meta:
        unique_together = ['name']

    name = models.CharField(max_length=40)
    host = models.CharField(max_length=100)
    port = models.IntegerField()

    whitelist = models.TextField(default="[]")
    nominees = models.TextField(default="[]")
    evictees = models.TextField(default="[]")

    active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Block(models.Model):
    """ Info model """

    class Meta:
        unique_together = ['index', 'network']

    index = models.IntegerField()
    round_received = models.IntegerField()

    state_hash = models.CharField(max_length=44)
    peers_hash = models.CharField(max_length=44)
    frame_hash = models.CharField(max_length=44)

    # Relational fields
    network = models.ForeignKey(Network, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.network.name} - {self.index}'

    @property
    def transactions(self):
        """ Block Transactions """
        return Transaction.objects.filter(block=self)

    @property
    def internal_transactions(self):
        """ Block Internal Transactions """
        return InternalTransaction.objects.filter(block=self)

    @property
    def internal_transaction_receipts(self):
        """ Block Internal Transaction Receipts """
        return InternalTransactionReceipt.objects.filter(block=self)

    @property
    def signature(self):
        """ Block Signatures """
        return Signature.objects.filter(block=self)


class ValidatorHistory(models.Model):
    """ Validator History """

    class Meta:
        unique_together = ['consensus_round', 'network']

    consensus_round = models.IntegerField()

    network = models.ForeignKey(Network, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.network.name} - {self.consensus_round}'

    @property
    def validators(self):
        return Validator.objects.filter(history=self)


class Validator(models.Model):
    """ Validator model """

    class Meta:
        unique_together = ['public_key', 'history']

    host = models.CharField(max_length=100)
    port = models.IntegerField()
    public_key = models.CharField(max_length=132)
    moniker = models.CharField(max_length=30)

    reachable = models.BooleanField(default=False)

    # Relational fields
    network = models.ForeignKey(Network, on_delete=models.CASCADE)
    history = models.ForeignKey(ValidatorHistory, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.moniker} - {self.history.consensus_round}'

    @property
    def info(self):
        try:
            info = Info.objects.get(validator=self)
        except Info.DoesNotExist:
            info = None

        return info

    @property
    def version(self):
        try:
            version = Version.objects.get(validator=self)
        except Version.DoesNotExist:
            version = None

        return version


class Version(models.Model):
    """ Version data about validator node """

    class Meta:
        unique_together = ['validator']

    validator = models.ForeignKey(Validator, on_delete=models.CASCADE)

    babble = models.CharField(max_length=50)
    evm_lite = models.CharField(max_length=50)
    monetd = models.CharField(max_length=50)

    solc = models.CharField(max_length=100)
    solc_os = models.TextField()

    def __str__(self):
        return self.monetd


class Info(models.Model):
    """ Info model """

    class Meta:
        unique_together = ['validator']

    e_id = models.TextField()

    type = models.CharField(max_length=30)
    state = models.CharField(max_length=50)

    consensus_events = models.IntegerField()
    consensus_transactions = models.IntegerField()
    last_block_index = models.IntegerField()
    last_consensus_round = models.IntegerField()
    last_peer_change = models.IntegerField()
    min_gas_price = models.IntegerField()
    num_peers = models.IntegerField()
    undetermined_events = models.IntegerField()
    transaction_pool = models.IntegerField()

    sync_rate = models.DecimalField(max_digits=50, decimal_places=4)
    events_per_second = models.DecimalField(max_digits=50, decimal_places=4)
    rounds_per_second = models.DecimalField(max_digits=50, decimal_places=4)

    # Relational Fields
    validator = models.ForeignKey(Validator, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.validator.moniker} - {self.type}'


class Transaction(models.Model):
    """ Transaction model """

    data = models.TextField()

    sender = models.CharField(max_length=42, blank=True, null=True)
    to = models.CharField(max_length=42, blank=True, null=True)
    amount = models.TextField(blank=True, null=True)
    gas = models.TextField(blank=True, null=True)
    gas_price = models.IntegerField(default=0, blank=True, null=True)
    nonce = models.IntegerField(default=0, blank=True, null=True)
    payload = models.TextField(blank=True, null=True)

    # Relational fields
    block = models.ForeignKey(Block, on_delete=models.CASCADE)
    
    tx_hash = models.TextField(blank=True, null=True)


class InternalTransaction(models.Model):
    """ Internal Transaction model """

    class Meta:
        verbose_name = 'Internal Transaction'
        verbose_name_plural = 'Internal Transactions'

    data = models.TextField()

    # Relational fields
    block = models.ForeignKey(Block, on_delete=models.CASCADE)


class InternalTransactionReceipt(models.Model):
    """ Internal Transaction Receipt model """

    class Meta:
        verbose_name = 'Internal Transaction Receipt'
        verbose_name_plural = 'Internal Transaction Receipts'

    data = models.TextField()

    # Relational fields
    block = models.ForeignKey(Block, on_delete=models.CASCADE)


class Signature(models.Model):
    """ Signature model """

    signature = models.TextField()

    # Relational Fields
    validator = models.ForeignKey(Validator, on_delete=models.CASCADE)
    block = models.ForeignKey(Block, on_delete=models.CASCADE)


class FaucetTransaction(models.Model):
    """ Faucet Transaction model """

    created = models.DateTimeField(auto_now_add=True)

    address = models.CharField(max_length=42)
    amount = models.IntegerField(help_text="Amount in Tenom")

    def __str__(self):
        return f'{self.address} - {self.amount}'
