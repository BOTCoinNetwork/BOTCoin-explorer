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
import Loader from '../components/Loader';
import Table from '../components/Table';

import { SContent, SSection } from '../components/styles';

import { fetchNetworkBlocks, fetchTransactions } from '../modules/dashboard';
import {
	selectBlocks,
	selectTransactions,
	selectTxsLoading
} from '../selectors';

import contract from '../assets/contract.svg';

import { Overlay, Tooltip } from 'react-bootstrap';
import { currencyFormatBOC } from '../utils';

import HashTooltip from '../containers/HashTooltip';


const SLink = styled(Link)`
	text-decoration: none !important;
`;

const Blocks: React.FC<{}> = () => {
    const dispatch = useDispatch();

    const txLoading = useSelector(selectTxsLoading);
    const blocks = useSelector(selectBlocks);
    const transactions = useSelector(selectTransactions);

    const fetchBlocks = () => dispatch(fetchNetworkBlocks());
    const fetchTxs = () => dispatch(fetchTransactions());

    useEffect(() => {
        fetchBlocks();
        fetchTxs();

        const interval = setInterval(() => {
            fetchBlocks();
            fetchTxs();
        }, 5000);

        return () => clearInterval(interval);
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
							<h3 style={{ height: '36px', lineHeight: '36px'}}>
								Recent Transactions{' '}
								<Loader loading={txLoading} />
							</h3>
							<div className="padding">
								<Table>
									<thead>
										<tr>
											<th>Block Index</th>
											<th>TX Hash</th>
											<th>From</th>
											<th>To</th>
											<th style={{ minWidth: '10rem' }}>Value</th>
											<th>Gas Fee</th>
											<th className="text-center">
												Contract Call?
											</th>
										</tr>
									</thead>
									<tbody>
                                        {transactions.map((t) => (
                                            <tr key={t.data}>
                                                <td>{t.block_id}</td>
                                                <td>
                                                    <HashTooltip hash={t.tx_hash} />
                                                </td>
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
													{currencyFormatBOC(new Currency(Number(t.amount)))}
                                                </td>
                                                {/* <td>{commaSeperate(t.gas)}</td>
                                                <td>{t.gas_price}</td> */}
                                                <td>{t.gas_price / (10 ** 18) * t.gas} BOC</td> 
                                                <td className="text-center">
                                                    {(t.payload.length > 0 && (
                                                        <img
                                                            src={contract}
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
