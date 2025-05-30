import request from 'request';

import { IBaseAccount, IReceipt } from 'evm-lite-client';

import * as types from './types';

import Client from './Client';

class CoreAPI extends Client {
	constructor() {
		super();
	}

	// Test function
	public async getHashgraph(): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			request.get(
				`http://monet.appmaven.io:8080/graph`,
				(error, response, body) => {
					if (error) {
						return reject(error);
					}
					if (!error && response.statusCode === 200) {
						resolve(JSON.parse(body));
					}
				}
			);
		});
	}

	// Faucet Transaction
	public async submitFaucetTx(address: string): Promise<IReceipt> {
		return new Promise<IReceipt>((resolve, reject) => {
			request.post(
				`http://${this.host}:${this.port}/api/faucet/`,
				{ json: { address } },
				(error, response, body) => {
					if (error) {
						return reject(error);
					}
					if (!error && response.statusCode === 200) {
						resolve(body);
					}
				}
			);
		});
	}

	/**
	 * Search capabilities
	 */
	public async fetchAddress(
		network: string,
		address: string
	): Promise<IBaseAccount> {
		return JSON.parse(
			await this.get(`/api/account/${address}/?network=${network}`)
		);
	}

	/**
	 * Network and Validator related API calls
	 */
	public async fetchNetworks(): Promise<types.Network[]> {
		return JSON.parse(await this.get('/api/networks/')).results;
	}

	public async fetchValidators(
		network: string,
		round?: number
	): Promise<types.Validator[]> {
		let url = `/api/validators/?network=${network}`;

		if (round || round === 0) {
			url += `&round=${round}`;
		}

		return JSON.parse(await this.get(url)).results;
	}

	public async fetchValidatorsInfo(network: string): Promise<types.Info[]> {
		return JSON.parse(await this.get(`/api/infos/?network=${network}`))
			.results;
	}

	public async fetchValidatorHistory(
		network: string
	): Promise<types.ValidatorHistory[]> {
		return JSON.parse(await this.get(`/api/history/?network=${network}`))
			.results;
	}

	/**
	 * Statistics, Transactions & Blocks
	 */
	public async fetchBlocks(
		network: string,
		offset?: number
	): Promise<types.Block[]> {
		let url = `/api/blocks/?network=${network}`;

		if (offset) {
			url += `&limit=10&offset=${offset}`;
		}

		return JSON.parse(await this.get(url)).results;
	}

	public async fetchTxs(network: string, offset?: number): Promise<types.TransactionInfo> {

		let url = `/api/transactions/?network=${network}`;
		
		if (offset) {
			url += `&limit=20&offset=${offset}`;
		}

		return JSON.parse(await this.get(url));
	}

	public async fetchStats(network: string): Promise<types.Stats> {
		return JSON.parse(await this.get(`/api/stats/?network=${network}`));
	}

	/**
	 * POA related API calls
	 */
	public async fetchWhitelist(
		network: string
	): Promise<types.WhitelistEntry[]> {
		return JSON.parse(
			await this.get(`/api/whitelist/?network=${network.toLowerCase()}`)
		);
	}

	public async fetchNominees(network: string): Promise<types.NomineeEntry[]> {
		return JSON.parse(
			await this.get(`/api/nominees/?network=${network.toLowerCase()}`)
		);
	}
}

export default CoreAPI;
