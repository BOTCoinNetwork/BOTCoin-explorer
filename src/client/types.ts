export type Network = {
	name: string;
	host: string;
	port: number;
};

export type Version = {
	monetd: string;
	babble: string;
	evm_lite: string;
	solc: string;
	solc_os: string;
};

export type Validator = {
	moniker: string;
	host: string;
	public_key: string;
	network: Network;
	reachable: boolean;
	info: Info;
	version: Version;
};

export type Info = {
	e_id: number;
	type: string;
	state: string;
	consensus_events: number;
	transactions: number;
	last_block_index: number;
	last_consensus_round: number;
	last_peer_change: number;
	min_gas_price: number;
	num_peers: number;
	undetermined_events: number;
	transaction_pool: number;
	sync_rate: string;
	events_per_second: string;
	rounds_per_second: string;
};

export type Transaction = {
	data: string;
	
	sender: string;
	to: string;
	amount: string;
	gas: number;
	gas_price: number;
	nonce: number;
	payload: string;
	tx_hash: string;
	block_id: number;
};

export type InternalTransaction = {
	data: string;
};

export type InternalTransactionReceipt = {
	data: string;
};

export type Signature = {
	signature: string;
	validator: Validator;
};

export type Block = {
	index: number;
	round_received: number;
	state_hash: string;
	peers_hash: string;
	frame_hash: string;
	network: Network;
	transactions: Transaction[];
	internal_transactions: InternalTransaction[];
	internal_transaction_receipts: InternalTransactionReceipt[];
	signatures: Signature[];
};

export type ValidatorHistory = {
	consensus_round: number;
	validators: Validator[];
};

export type Stats = {
	block_height: number;
	tx_count: number;
	int_tx_count: number;
};

export type Application = {
	id: number;
	owner: string;
	repository_name: string;
	description: string;
};

export type WhitelistEntry = {
	address: string;
	moniker: string;
};

export type NomineeEntry = {
	address: string;
	moniker: string;
	upVotes: number;
	downVotes: number;
};

export type EvicteeEntry = {
	address: string;
	moniker: string;
	upVotes: number;
	downVotes: number;
};
