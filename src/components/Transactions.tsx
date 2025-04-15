import React, { useCallback, useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { Currency } from 'evm-lite-utils';
import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';

import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import Avatar from '../components/Avatar';
import Block from '../components/Block';
import Loader from '../components/Loader';
import Table from '../components/Table';

import { SContent, SSection } from '../components/styles';

import { fetchNetworkBlocks, fetchTransactions } from '../modules/dashboard';
import {
	selectBlocks,
	selectBlocksLoading,
	selectTransactions,
	selectTxsLoading
} from '../selectors';
import { commaSeperate } from '../utils';

const SLink = styled(Link)`
	text-decoration: none !important;
`;

const Blocks: React.FC<{}> = () => {
	const dispatch = useDispatch();

	const loading = useSelector(selectBlocksLoading);
	const txLoading = useSelector(selectTxsLoading);

	const blocks = useSelector(selectBlocks);
	const transactions = useSelector(selectTransactions);

	const fetchBlocks = () => dispatch(fetchNetworkBlocks());
	const fetchTxs = () => dispatch(fetchTransactions());

	useEffect(() => {
		fetchBlocks();
		fetchTxs();
	}, []);

	useEffect(() => {
		ReactTooltip.rebuild();
	}, [blocks]);

	return (
		<SSection>
			<Container fluid={false}>
				<Row>
					<Col md={12} lg={12}>
						<SContent>
							<h3>
								Recent Transactions{' '}
								<Loader loading={txLoading} />
							</h3>
							<div className="padding">
								<Table>
									<thead>
										<tr>
											<th>Hash</th>
											<th>From</th>
											<th>To</th>
											<th>Value</th>
											<th>Gas</th>
											<th>Gas Price</th>
											<th className="text-center">
												Contract Call?
											</th>
										</tr>
									</thead>
									<tbody>
										{transactions.map((t) => (
											<tr key={t.data}>
												<td>{t.tx_hash}</td>
												<td>
													<Avatar
														address={t.sender}
														size={35}
													/>
												</td>
												<td>
													<Avatar
														address={t.to}
														size={35}
													/>
												</td>
												<td>
													{new Currency(
														t.amount === '0'
															? 0
															: t.amount + 'a'
													).format('T')}
												</td>
												<td>{commaSeperate(t.gas)}</td>
												<td>{t.gas_price}</td>
												<td className="text-center">
													{(t.payload.length > 0 && (
														<img
															src="https://image.flaticon.com/icons/svg/1828/1828640.svg"
															width={20}
														/>
													)) ||
														'-'}
												</td>
											</tr>
										))}
									</tbody>
								</Table>
							</div>
						</SContent>
					</Col>
				</Row>
			</Container>
		</SSection>
	);
};

export default Blocks;
