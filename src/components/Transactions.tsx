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


const SLink = styled(Link)`
	text-decoration: none !important;
`;

const HashSpan = styled.span`
    cursor: pointer;
    color:rgb(16, 72, 135);
`;

const CopyButton = styled.button`
    margin-left: 10px;
    padding: 2px 18px;
    border: none;
    background:rgb(16, 54, 95);
    color: white;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    &:hover {
        background:rgb(28, 90, 155);
    }
`;

const shortenHash = (hash: string) => {
    if (!hash) return '';
    return `${hash.substring(0, 10)}......${hash.substring(hash.length - 10)}`;
};

const Blocks: React.FC<{}> = () => {
    const dispatch = useDispatch();
    const [showTooltip, setShowTooltip] = useState<string | null>(null);
    const [targetRef, setTargetRef] = useState<HTMLElement | null>(null);
    const [copySuccess, setCopySuccess] = useState<string | null>(null);

    const handleHashClick = useCallback((event: React.MouseEvent<HTMLSpanElement>, hash: string) => {
        setTargetRef(event.currentTarget);
        setShowTooltip(showTooltip === hash ? null : hash);
    }, [showTooltip]);

    const handleCopy = useCallback((text: string) => {
        navigator.clipboard.writeText(text);
        setCopySuccess(text);
        setTimeout(() => setCopySuccess(null), 2000);
    }, []);

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
											<th>Block Index</th>
											<th>TX Hash</th>
											<th>From</th>
											<th>To</th>
											<th>Value</th>
											{/* <th>Gas</th>
											<th>Gas Price</th> */}
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
                                                    <HashSpan 
                                                        onClick={(e) => handleHashClick(e, t.tx_hash)}
                                                    >
                                                        {shortenHash(t.tx_hash)}
                                                    </HashSpan>
                                                    {targetRef && (
                                                        <Overlay
                                                            show={showTooltip === t.tx_hash}
                                                            target={targetRef}
                                                            placement="top"
                                                            rootClose={true}
                                                            onHide={() => setShowTooltip(null)}
                                                        >
                                                            <Tooltip id={`tooltip-${t.tx_hash}`}>
                                                                <div>
                                                                    {t.tx_hash}
                                                                    <CopyButton onClick={() => handleCopy(t.tx_hash)}>
                                                                        {copySuccess === t.tx_hash ? 'copyed!' : 'copy'}
                                                                    </CopyButton>
                                                                </div>
                                                            </Tooltip>
                                                        </Overlay>
                                                    )}
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
                                                    {new Currency(
                                                        t.amount === '0'
                                                            ? 0
                                                            : t.amount + 'a'
                                                    ).format('T')}
                                                </td>
                                                {/* <td>{commaSeperate(t.gas)}</td>
                                                <td>{t.gas_price}</td> */}
                                                <td>{t.gas_price / (10 ** 18) * t.gas}</td> 
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
