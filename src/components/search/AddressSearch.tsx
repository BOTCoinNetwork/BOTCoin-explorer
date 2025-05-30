import React, { useEffect, useState } from 'react';
import utils, { Currency } from 'evm-lite-utils';
import styled from 'styled-components';
import { IBaseAccount } from 'evm-lite-client';
import { useSelector } from 'react-redux';
import Media from 'react-bootstrap/Media';
import Table from 'react-bootstrap/Table';
import Avatar from '../../components/Avatar';
import CoreAPI from '../../client';
import { selectNetwork } from '../../selectors';
import { currencyFormatBOC } from '../../utils';
import Grid, { Quadrant as Q, Section } from '../../ui';
import contract from '../../assets/contract.svg';

const SAccounts = styled.div``;
const SInfoCard = styled.div`
  background: white;
  padding: 10px;
  border-radius: 8px;
  margin-top: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
`;

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

	const renderAccountDetails = () => {
		if (!account.address) return null;

		return (
			<SInfoCard>
				<h4>Account</h4>
				<Table striped bordered hover>
					<tbody>
						<tr>
							<td><strong>account</strong></td>
							<td className="mono">{account.address}</td>
						</tr>
						<tr>
							<td><strong>balance</strong></td>
							<td>{currencyFormatBOC(new Currency(account.balance || 0))}</td>
						</tr>
						<tr>
							<td><strong>nonce</strong></td>
							<td>{account.nonce || '0'}</td>
						</tr>
						{/* <tr>
							<td><strong>transactionCount</strong></td>
							<td>{account.transactionCount || '0'}</td>
						</tr> */}
						<tr>
							<td><strong>is contract</strong></td>
							<td>{account.bytecode ? <img src={contract} width={20} /> : '-'} </td>
						</tr>
					</tbody>
				</Table>
			</SInfoCard>
		);
	};

	return (
		<>
			<SAccounts>
				<Section padding={20}>
					<Grid>
						<Q pos={[1, 1]}>
							<h3>Account details</h3>
							<br />
							{(!error && Object.keys(account).length > 0) ? (
								<div className="padding">
									<Media>
										<Avatar address={account.address ? account.address : ''} />
										<Media.Body>
											<b className="mono">{account.address ? account.address : ''}</b>
											<div className="mono">
												{currencyFormatBOC(new Currency(account.balance || 0))}
											</div>
										</Media.Body>
									</Media>
									{renderAccountDetails()}
								</div>
							) : error || ''}
						</Q>
					</Grid>
				</Section>
			</SAccounts>
		</>
	);
};

export default AddressSearch;
