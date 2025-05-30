import { BaseAction, Result } from '.';

import CoreAPI, {
	Block,
	Network,
	NomineeEntry,
	Transaction,
	TransactionInfo,
	Validator,
	WhitelistEntry
} from '../client';

const FETCH_NETWORKS_INIT = '@monet/dashboard/network/FETCH/INIT';
const FETCH_NETWORKS_SUCCESS = '@monet/dashboard/network/FETCH/SUCCESS';
const FETCH_NETWORKS_ERROR = '@monet/dashboard/network/FETCH/ERROR';

const FETCH_VALIDATORS_INIT = '@monet/dashboard/validators/FETCH/INIT';
const FETCH_VALIDATORS_SUCCESS = '@monet/dashboard/validators/FETCH/SUCCESS';
const FETCH_VALIDATORS_ERROR = '@monet/dashboard/validators/FETCH/ERROR';

const FETCH_BLOCKS_INIT = '@monet/dashboard/blocks/FETCH/INIT';
const FETCH_BLOCKS_SUCCESS = '@monet/dashboard/blocks/FETCH/SUCCESS';
const FETCH_BLOCKS_ERROR = '@monet/dashboard/blocks/FETCH/ERROR';

const FETCH_POA_INIT = '@monet/dashboard/POA/FETCH/INIT';
const FETCH_POA_SUCCESS = '@monet/dashboard/POA/FETCH/SUCCESS';
const FETCH_POA_ERROR = '@monet/dashboard/POA/FETCH/ERROR';

const FETCH_TRANSACTIONS_INIT = '@monet/dashboard/TRANSACTIONS/FETCH/INIT';
const FETCH_TRANSACTIONS_SUCCESS =	'@monet/dashboard/TRANSACTIONS/FETCH/SUCCESS';
const FETCH_TRANSACTIONS_ERROR = '@monet/dashboard/TRANSACTIONS/FETCH/ERROR';

const SELECT_NETWORK = '@monet/dashboard/network/SELECT';

export type DashboardState = {
	networks: Network[];

	selectedNetwork?: Network;

	validators: Validator[];
	blocks: Block[];
	// transactions: Transaction[];
	transactionInfo: TransactionInfo;

	whitelist: WhitelistEntry[];
	nominees: NomineeEntry[];

	error?: string;

	loading: {
		// transactions: boolean;
		transactionInfo: boolean;
		networks: boolean;
		validators: boolean;
		infos: boolean;
		blocks: boolean;
		poa: boolean;
	};
};

const initial: DashboardState = {
	networks: [],
	validators: [],
	blocks: [],
	// transactions: [],
	transactionInfo: {
		count: 0,
		next: '',
		previous: '',
		results: [] 
	},
	whitelist: [],
	nominees: [],

	loading: {
		// transactions: false,
		transactionInfo: false,
		networks: false,
		validators: false,
		infos: false,
		blocks: false,
		poa: false
	}
};

const c = new CoreAPI();

export default (
	state: DashboardState = initial,
	action: BaseAction<any>
): DashboardState => {
	switch (action.type) {
		case SELECT_NETWORK:
			return {
				...state,
				selectedNetwork: action.payload
			};

		case FETCH_NETWORKS_INIT:
			return {
				...state,
				error: undefined,
				loading: {
					...state.loading,
					networks: true
				}
			};

		case FETCH_NETWORKS_SUCCESS:
			return {
				...state,
				networks: action.payload,
				error: undefined,
				loading: {
					...state.loading,
					networks: false
				}
			};

		case FETCH_NETWORKS_ERROR:
			return {
				...state,
				error: action.payload,
				loading: {
					...state.loading,
					networks: false
				}
			};

		case FETCH_VALIDATORS_INIT:
			return {
				...state,
				error: undefined,
				loading: {
					...state.loading,
					validators: true
				}
			};

		case FETCH_VALIDATORS_SUCCESS:
			return {
				...state,
				validators: action.payload,
				error: undefined,
				loading: {
					...state.loading,
					validators: false
				}
			};

		case FETCH_VALIDATORS_ERROR:
			return {
				...state,
				error: action.payload,
				loading: {
					...state.loading,
					validators: false
				}
			};

		case FETCH_BLOCKS_INIT:
			return {
				...state,
				error: undefined,
				loading: {
					...state.loading,
					blocks: true
				}
			};

		case FETCH_BLOCKS_SUCCESS:
			return {
				...state,
				blocks: action.payload,
				error: undefined,
				loading: {
					...state.loading,
					blocks: false
				}
			};

		case FETCH_BLOCKS_ERROR:
			return {
				...state,
				error: action.payload,
				loading: {
					...state.loading,
					blocks: false
				}
			};

		case FETCH_POA_INIT:
			return {
				...state,
				error: undefined,
				loading: {
					...state.loading,
					poa: true
				}
			};

		case FETCH_POA_SUCCESS:
			return {
				...state,
				whitelist: action.payload.whitelist,
				nominees: action.payload.nominees,
				error: undefined,
				loading: {
					...state.loading,
					poa: false
				}
			};

		case FETCH_POA_ERROR:
			return {
				...state,
				error: action.payload,
				whitelist: [],
				nominees: [],
				loading: {
					...state.loading,
					poa: false
				}
			};

		case FETCH_TRANSACTIONS_INIT:
			return {
				...state,
				error: undefined,
				loading: {
					...state.loading,
					transactionInfo: true
				}
			};

		case FETCH_TRANSACTIONS_SUCCESS:
			return {
				...state,
				transactionInfo: action.payload,
				error: undefined,
				loading: {
					...state.loading,
					transactionInfo: false
				}
			};

		case FETCH_TRANSACTIONS_ERROR:
			return {
				...state,
				error: action.payload,
				whitelist: [],
				loading: {
					...state.loading,
					transactionInfo: false
				}
			};

		default:
			return state;
	}
};

export function fetchNetworks(): Result<Promise<Network[]>> {
	return async dispatch => {
		dispatch({
			type: FETCH_NETWORKS_INIT
		});

		try {
			const networks = await c.fetchNetworks();

			dispatch({
				type: FETCH_NETWORKS_SUCCESS,
				payload: networks.reverse()
			});

			return networks;
		} catch (e) {
			dispatch({
				type: FETCH_NETWORKS_ERROR,
				payload: e.toString()
			});

			return [];
		}
	};
}

export function selectNetwork(networkName: string): Result<Promise<Network>> {
	return async (dispatch, getState) => {
		const state = getState();

		const network: Network = state.networks.filter(
			n => n.name.toLowerCase() === networkName.toLowerCase()
		)[0];

		await dispatch({
			type: SELECT_NETWORK,
			payload: network
		});

		await dispatch(fetchAll());

		return network;
	};
}

export function fetchAll(): Result<Promise<void>> {
	return async dispatch => {
		dispatch(fetchValidators());
		dispatch(fetchPOA());
	};
}

export function fetchValidators(): Result<Promise<Validator[]>> {
	return async (dispatch, getState) => {
		const state = getState();

		dispatch({
			type: FETCH_VALIDATORS_INIT
		});

		try {
			const validators = await c.fetchValidators(
				state.selectedNetwork!.name
			);

			dispatch({
				type: FETCH_VALIDATORS_SUCCESS,
				payload: validators
			});

			return validators;
		} catch (e) {
			dispatch({
				type: FETCH_VALIDATORS_ERROR,
				payload: e.toString()
			});
		}

		return [];
	};
}

export function fetchNetworkBlocks(): Result<Promise<Block[]>> {
	return async (dispatch, getState) => {
		const state = getState();

		dispatch({
			type: FETCH_BLOCKS_INIT
		});

		try {
			const blocks = await c.fetchBlocks(state.selectedNetwork!.name);

			dispatch({
				type: FETCH_BLOCKS_SUCCESS,
				payload: blocks
			});

			return blocks;
		} catch (e) {
			dispatch({
				type: FETCH_BLOCKS_ERROR,
				payload: e.toString()
			});
		}

		return [];
	};
}

export function fetchPOA(): Result<Promise<void>> {
	return async (dispatch, getState) => {
		const state = getState();
		const network = state.selectedNetwork;

		dispatch({
			type: FETCH_POA_INIT
		});

		try {
			const whitelist = await c.fetchWhitelist(
				network!.name.toLowerCase()
			);
			const nominees = await c.fetchNominees(network!.name.toLowerCase());

			dispatch({
				type: FETCH_POA_SUCCESS,
				payload: {
					whitelist,
					nominees
				}
			});
		} catch (e) {
			dispatch({
				type: FETCH_POA_ERROR,
				payload: e.toString()
			});
		}
	};
}

export function fetchTransactions(offset?: number): Result<Promise<void>> {
	return async (dispatch, getState) => {
		const state = getState();
		const network = state.selectedNetwork;

		dispatch({
			type: FETCH_TRANSACTIONS_INIT
		});

		try {
			const transactionInfo = await c.fetchTxs(
				network!.name.toLowerCase(),
				offset
			);

            dispatch({
                type: FETCH_TRANSACTIONS_SUCCESS,
                payload: transactionInfo
            });
        } catch (e) {
            dispatch({
                type: FETCH_TRANSACTIONS_ERROR,
                payload: e.toString()
            });
        }
    };
}
