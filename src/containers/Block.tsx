import React from 'react';

import styled from 'styled-components';

import { Currency } from 'evm-lite-utils';
import { useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Media from 'react-bootstrap/Media';
import Row from 'react-bootstrap/Row';

import Avatar from '../components/Avatar';
import Signature from '../components/Signature';
import Table from '../components/Table';

import { SContent, SJumbotron, SSection } from '../components/styles';

import { selectBlock } from '../selectors';

import Grid, { Section, Quadrant } from '../ui';
import contract from '../assets/contract.svg';

type Props = {
	index: string;
};

const SBlock = styled.div`
	display: block;
	padding-top: 10px;
	padding-bottom: 15px;

	& + & {
		padding: 15px 0;
		border-top: 1px solid #eee;
	}
`;

const SWhite = styled.div`
	background: white;
	border-top: 1px solid #eee;
`;

const Block: React.FC<RouteComponentProps<Props>> = props => {
	const block = useSelector(selectBlock(Number(props.match.params.index)));

	return (
		(block && (
			<>
				<SJumbotron>
					<Section padding={30}>
						<Container>
							<h1>Block #{block.index}</h1>
							<p className="mono">{block.state_hash}</p>
						</Container>
					</Section>
				</SJumbotron>
				<SWhite>
					<Section padding={30}>
						<Grid verticalAlign={false}>
							<Quadrant pos={[1, 1]}>
								<SContent>
									<h3>Transactions</h3>
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
											{block.transactions.map(t => (
												<>
													<tr key={t.data}>
														<td>{t.tx_hash}</td>
														<td>
															<Avatar
																address={
																	t.sender
																}
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
																	: t.amount +
																	  'a'
															).format('T')}
														</td>
														<td>{t.gas}</td>
														<td>{t.gas_price}</td>
														<td className="text-center">
															{(t.payload.length >
																0 && (
																<img
																	src={contract}
																	width={20}
																/>
															)) ||
																'-'}
														</td>
													</tr>
												</>
											))}
										</tbody>
									</Table>
								</SContent>
							</Quadrant>
							<Quadrant pos={[1, 2]}>
								<SContent>
									<h3>Signatures</h3>
									<div className="padding pad white">
										{block.signatures.map(s => (
											<SBlock key={s.signature}>
												<Signature
													key={s.signature}
													validator={s.validator}
													signature={s.signature}
												/>
											</SBlock>
										))}
									</div>
								</SContent>
							</Quadrant>
						</Grid>
					</Section>
				</SWhite>
				<SWhite>
					<Section padding={30}>
						<Grid>
							<Quadrant pos={[1, 1]}>
								<SContent>
									<h3>Internal Transactions</h3>
									<div className="padding pad mono">
										{block.internal_transactions.map(t => (
											<>
												<code>
													<pre>
														{JSON.stringify(
															JSON.parse(
																t.data.replace(
																	/'/g,
																	'"'
																)
															),
															null,
															4
														)}
													</pre>
												</code>
											</>
										))}
									</div>
								</SContent>
							</Quadrant>
						</Grid>
					</Section>
				</SWhite>
			</>
		)) || <></>
	);
};

export default Block;
