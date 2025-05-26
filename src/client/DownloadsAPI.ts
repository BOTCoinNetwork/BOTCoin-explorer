import * as types from './types';

import Client from './Client';

class DownloadsAPI extends Client {
	constructor() {
		super();
	}

	public async getApplications(): Promise<types.Application[]> {
		return JSON.parse(await this.get(`/api/downloads/applications/`))
			.results;
	}

	public async directDownload(app: string, os: 'Android' | 'iOS') {
		return await this.get(`/api/downloads/${app}/?os=${os}`);
	}
}

export default DownloadsAPI;
