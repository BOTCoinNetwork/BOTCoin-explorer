""" Botcoin Explorer Admin """

from django.contrib import admin

from . import models

admin.site.site_header = 'Botcoin Explorer'


class NetworkAdmin(admin.ModelAdmin):
    """ Admin config for Network model """

    list_display = ('id', 'name', 'host', 'port',
                    'active', 'whitelist', 'nominees', 'evictees')


class VersionAdmin(admin.ModelAdmin):
    """ Admin config for Version model """

    list_display = ('id', 'validator', 'monetd', 'babble',
                    'evm_lite', 'solc', 'solc_os')


class ValidatorAdmin(admin.ModelAdmin):
    """ Admin config for Validator model """

    list_display = ('id', 'network', 'moniker', 'host',
                    'port', 'public_key', 'history')


class InfoAdmin(admin.ModelAdmin):
    """ Admin config for Info model """

    list_display = ('id', 'validator', 'e_id', 'type', 'state',
                    'consensus_events', 'transactions',
                    'last_block_index', 'last_consensus_round',
                    'last_peer_change', 'min_gas_price', 'num_peers',
                    'undetermined_events', 'transaction_pool', 'sync_rate',
                    'events_per_second', 'rounds_per_second')


class BlockAdmin(admin.ModelAdmin):
    """ Admin config for Block model """

    list_display = ('id', 'network', 'index', 'round_received',
                    'state_hash', 'peers_hash', 'frame_hash')


class BlockTransactionAdmin(admin.ModelAdmin):
    """ Admin config for Transaction model """

    list_display = ('id', 'block', 'data')


class BlockInternalTransactionAdmin(admin.ModelAdmin):
    """ Admin config for InternalTransaction model """

    list_display = ('id', 'block', 'data')


class BlockInternalTransactionReceiptAdmin(admin.ModelAdmin):
    """ Admin config for InternalTransactionReceiptA model """

    list_display = ('id', 'block', 'data')


class BlockSignatureAdmin(admin.ModelAdmin):
    """ Admin config for Siganture model """

    list_display = ('id', 'block', 'validator', 'signature')


class FaucetTransactionAdmin(admin.ModelAdmin):
    """ Admin config for Faucet Transaction model """

    list_display = ('id', 'created', 'address', 'amount')


class ValidatorHistoryAdmin(admin.ModelAdmin):
    """ Admin config for Faucet Transaction model """

    list_display = ('id', 'consensus_round', 'network')


def _register(model, admin_class):
    admin.site.register(model, admin_class)


_register(models.Validator, ValidatorAdmin)
_register(models.Version, VersionAdmin)
_register(models.FaucetTransaction, FaucetTransactionAdmin)
_register(models.Network, NetworkAdmin)
_register(models.Info, InfoAdmin)
_register(models.Block, BlockAdmin)
_register(models.Transaction, BlockTransactionAdmin)
_register(models.InternalTransaction, BlockInternalTransactionAdmin)
_register(models.ValidatorHistory, ValidatorHistoryAdmin)
_register(models.InternalTransactionReceipt,
          BlockInternalTransactionReceiptAdmin)
_register(models.Signature,
          BlockSignatureAdmin)
