import { Store } from '../store';

export const selectAllNetworks = (store: Store) => store.networks;

export const selectNetwork = (store: Store) => store.selectedNetwork;
export const selectValidators = (store: Store) => store.validators;
export const selectBlocks = (store: Store) => store.blocks;
// export const selectTransactions = (store: Store) => store.transactions;
export const selectTransactionInfo = (store: Store) => store.transactionInfo;

export const selectValidator = (pubKey: string) => (store: Store) =>
	store.validators.find(v => v.public_key === pubKey);
export const selectBlock = (blockindex: number) => (store: Store) =>
	store.blocks.find(i => i.index === blockindex);

export const selectBlocksLoading = (store: Store) => store.loading.blocks;
export const selectTxsLoading = (store: Store) => store.loading.transactionInfo;

export const selectWhitelist = (store: Store) => store.whitelist;
export const selectNominees = (store: Store) => store.nominees;

export const LOCAL_NETWORK = {
	host: 'localhost',
	port: 8080
};
