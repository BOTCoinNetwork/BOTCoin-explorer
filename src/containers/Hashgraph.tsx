import React, { useEffect, useState } from 'react';

import { Layer, Stage } from 'react-konva';

import styled from 'styled-components';

import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

import Loader from '../components/Loader';

import { SContent } from '../components/styles';
import { Event, EventNode, Peer, PeerNode } from '../hashgraph';

import ValidatorAvatar from '../components/ValidatorAvatar';

import ExplorerAPIClient from '../client';
import HGParser from '../hashgraph/HashgraphParser';

const SCode = styled.code`
	cursor: pointer;
`;

const Hashgraph: React.FC<{}> = () => {
	let container: any;

	const [width, setWidth] = useState(0);
	const [height, setHeight] = useState(400);

	const client = new ExplorerAPIClient();

	const [loading, setLoading] = useState<boolean>(false);
	const [peerNodes, setPeerNodes] = useState<PeerNode[]>([]);
	const [eventNodes, setEventNodes] = useState<EventNode[]>([]);

	const [selectedEventNode, setSelectedEventNode] = useState<EventNode>(
		{} as EventNode
	);

	const fetchData = async () => {
		setLoading(true);
		const parser = new HGParser(await client.getHashgraph());

		setPeerNodes(parser.peerNodes);
		setEventNodes(parser.eventNodes);

		setLoading(false);
	};

	// draw fns
	const drawPeers = () =>
		peerNodes.map(p => <Peer key={p.publicKey} node={p} />);

	const drawEvents = () =>
		eventNodes.map(e => (
			<Event
				selected={
					(Object.keys(selectedEventNode).length > 0 &&
						selectedEventNode.hash === e.hash) ||
					false
				}
				key={e.hash}
				node={e}
				onClick={() => setSelectedEventNode(e)}
			/>
		));

	useEffect(() => {
		fetchData();
		checkSize();

		window.addEventListener('resize', checkSize);

		const c: any = document.getElementById('#coll');

		setWidth(400);

		return window.removeEventListener('resize', checkSize);
	}, []);

	useEffect(() => {
		if (eventNodes.length) {
			setSelectedEventNode(eventNodes.sort((a, b) => a.y - b.y)[0]);
		}
	}, [eventNodes]);

	// resize event
	function checkSize() {
		if (container) {
			const w = container.offsetWidth;
			const h = container.offsetHeight;

			console.log(w, h);

			// setWidth(w);
			setHeight(h);
		}
	}

	// onClickfn
	const clickEventHash = (hash: string) => () => {
		const event = eventNodes.find(e => e.hash === hash);

		if (event) {
			setSelectedEventNode(event);
		}
	};

	// render functions
	const renderEventInfo = () => {
		if (Object.keys(selectedEventNode).length) {
			return (
				<>
					<tr>
						<td>
							<b>Index</b>
						</td>
						<td>{selectedEventNode.event.Body.Index}</td>
					</tr>
					<tr>
						<td>
							<b>Round</b>
						</td>
						<td>{selectedEventNode.round}</td>
					</tr>
					<tr>
						<td>
							<b>Hash</b>
						</td>
						<td className="mono">
							<code>{selectedEventNode.hash}</code>
						</td>
					</tr>
					<tr>
						<td>
							<b>Self Parent</b>
						</td>
						<td className="mono">
							{selectedEventNode.parents
								.filter(
									p =>
										p.peer.publicKey ===
										selectedEventNode.peer.publicKey
								)
								.map(p => (
									<SCode
										onClick={clickEventHash(p.hash)}
										key={p.hash}
									>
										{p.hash}
										<br />
									</SCode>
								))}
						</td>
					</tr>
					<tr>
						<td>
							<b>Other Parent</b>
						</td>
						<td className="mono">
							{selectedEventNode.parents
								.filter(
									p =>
										p.peer.publicKey !==
										selectedEventNode.peer.publicKey
								)
								.map(p => (
									<SCode
										onClick={clickEventHash(p.hash)}
										key={p.hash}
									>
										{p.hash}
										<br />
									</SCode>
								))}
						</td>
					</tr>
					<tr>
						<td>
							<b>Transaction</b>
						</td>
						<td>
							{selectedEventNode.event.Body.Transactions.map(
								(t, i) => (
									<>
										<code key={`${t}tx${i}`}>{t}</code>
										<br />
									</>
								)
							)}
						</td>
					</tr>
					<tr>
						<td>
							<b>Event Signature</b>
						</td>
						<td>
							<code>{selectedEventNode.event.Signature}</code>
						</td>
					</tr>
				</>
			);
		}
	};

	const renderPeerInfo = () => {
		if (Object.keys(selectedEventNode).length) {
			return (
				<ValidatorAvatar
					validator={{
						moniker: `Peer ${selectedEventNode.peer.index}`,
						host: ``,
						public_key: selectedEventNode.peer.publicKey,
						network: {
							name: '',
							host: '',
							port: 0
						},
						reachable: true,
						info: {
							e_id: 0,
							type: '',
							state: '',
							consensus_events: 0,
							transactions: 0,
							last_block_index: 0,
							last_consensus_round: 0,
							last_peer_change: 0,
							min_gas_price: 0,
							num_peers: 0,
							undetermined_events: 0,
							transaction_pool: 0,
							sync_rate: '',
							events_per_second: '',
							rounds_per_second: ''
						},
						version: {
							evm_lite: '',
							babble: '',
							monetd: '',
							solc: '',
							solc_os: ''
						}
					}}
				/>
			);
		}
	};

	return (
		<Container fluid={true}>
			<Row>
				<Col id="#coll">
					<SContent
						ref={node => {
							container = node;
						}}
					>
						<Loader loading={loading} />
						<div className="padding">
							<Stage
								// offsetY={700}
								draggable={true}
								// dragBoundFunc={pos => {
								// 	return {
								// 		x: 0,
								// 		y: pos.y > 0 ? pos.y : 0
								// 	};
								// }}
								width={1000}
								height={window.innerHeight - 54}
							>
								<Layer>
									{drawPeers()}
									{drawEvents()}
								</Layer>
							</Stage>
						</div>
					</SContent>
				</Col>
				<Col md={4}>
					<SContent>
						<span>Peer</span>
						<div className={'padding'}>{renderPeerInfo()}</div>
					</SContent>
					<SContent>
						<span>Event</span>
						<div className={''}>
							<Table>
								<tbody>{renderEventInfo()}</tbody>
							</Table>
						</div>
					</SContent>
				</Col>
			</Row>
		</Container>
	);
};

export default Hashgraph;
