import React, { useEffect, useState } from 'react';

import utils, { Currency } from 'evm-lite-utils';
import styled from 'styled-components';

import { IBaseAccount } from 'evm-lite-client';
import { useSelector } from 'react-redux';

import Media from 'react-bootstrap/Media';

import Avatar from '../../components/Avatar';

import CoreAPI from '../../client';

import { selectNetwork } from '../../selectors';
import { currencyFormatBOC } from '../../utils';

import Grid, { Quadrant as Q, Section } from '../../ui';

const SAccounts = styled.div``;

type Props = {
	address: string;
};

const AddressSearch: React.FC<Props> = props => {
	const network = useSelector(selectNetwork);

	const [account, setAccount] = useState<IBaseAccount>({} as IBaseAccount);
	const [error, setError] = useState('');

	const c = new CoreAPI();

	const fetchAccount = async (n: string) => {
		if (utils.cleanAddress(props.address).length === 42) {
			try {
				const a = await c.fetchAddress(
					n.toLowerCase(),
					utils.cleanAddress(props.address)
				);

				// @ts-ignore
				if (account.error) {
					// @ts-ignore
					setError(a.error);
				} else {
					setAccount(a);
				}
			} catch {
				setError(`Error fetching account ${props.address}`);
			}
		} else {
			setError(`Not a valid address: ${props.address}`);
		}
	};

	useEffect(() => {
		if (network) {
			fetchAccount(network.name);
		}
	}, [network]);

	return (
		<>
			<SAccounts>
				<Section padding={30}>
					<Grid>
						<Q pos={[1, 1]}>
							<h3>Accounts</h3>
							<br />
							{(!error && Object.keys(account).length > 0 && (
								<div className="padding">
									<Media>
										<Avatar
											address={account.address.toLowerCase()}
										/>
										<Media.Body>
											<b className="mono">
												{account.address.toLowerCase()}
											</b>
											<div className="mono">
												{currencyFormatBOC(
													new Currency(
														account.balance
													)
												)} 
											</div>
										</Media.Body>
									</Media>
								</div>
							)) ||
								error ||
								''}
						</Q>
					</Grid>
				</Section>
			</SAccounts>
		</>
	);
};

export default AddressSearch;
