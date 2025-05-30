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

import { fetchTransactions } from '../modules/dashboard';
import {
	selectBlocks,
	// selectTransactions,
    selectTransactionInfo,
	selectTxsLoading
} from '../selectors';

import contract from '../assets/contract.svg';

import { currencyFormatBOC } from '../utils';

import HashTooltip from '../containers/HashTooltip';


const SLink = styled(Link)`
	text-decoration: none !important;
`;

const PaginationContainer = styled.div`
    display: flex;
    margin-top: 20px;
    padding-right: 4rem;
    justify-content: flex-end;
`;

const PaginationButton = styled.button`
    margin: 0 5px;
    padding: 5px 10px;
    border: 1px solid rgb(196, 199, 201);
    background: white;
    cursor: pointer;

    &.active {
        background: #6d11437d;
        color: white;
        border-color:rgb(196, 199, 201);
    }
`;

const Transactions: React.FC<{}> = () => {
    const dispatch = useDispatch();

    const txLoading = useSelector(selectTxsLoading);
    const transactionInfo = useSelector(selectTransactionInfo);
    const [currentOffset, setCurrentOffset] = useState(0); 

    // const currentTransactions = transactions.slice(indexOfFirstItem, indexOfLastItem);
    const currentTransactions = transactionInfo.results? transactionInfo.results: [];
    // add pagination logic
    const handlePageChange = (direction: 'next' | 'previous') => {
        if (transactionInfo[direction]) {
            const url = new URL(transactionInfo[direction]!);
            const offset = parseInt(url.searchParams.get('offset') || '0');
            console.log('currentOffset-offset:', offset);
            fetchTxs(offset);
            setCurrentOffset(offset); 
        }
    };

    const fetchTxs = (offset: number) => dispatch(fetchTransactions(offset));

    useEffect(() => {
        fetchTxs(currentOffset);
        const interval = setInterval(() => {
            if (currentOffset === 0) {
                fetchTxs(currentOffset);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [currentOffset]); 

	useEffect(() => {
		ReactTooltip.rebuild();
	}, [currentTransactions]);

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
                                        {currentTransactions.map((t) => ( 
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
                
                <PaginationContainer>
                    <PaginationButton 
                        onClick={() => handlePageChange('previous')}
                        disabled={!transactionInfo.previous}
                    >
                        Previous
                    </PaginationButton>
                    
                    <PaginationButton 
                        onClick={() => handlePageChange('next')}
                        disabled={!transactionInfo.next}
                    >
                        Next
                    </PaginationButton>
                </PaginationContainer>
                
            </Container>
        </SSection>
    );
};

export default Transactions;

