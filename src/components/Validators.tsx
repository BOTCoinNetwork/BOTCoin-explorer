import React from 'react';

import styled from 'styled-components';

import { Link } from 'react-router-dom';

import Image from 'react-bootstrap/Image';

import Avatar from './Avatar';
import Table from './Table';

import { Validator } from '../client';
import { pubKeyToAddress } from '../utils';

import GREEN from '../assets/green-dot.png';
import RED from '../assets/red-dot.png';

const Green = styled.div`
	color: var(--green) !important;
	font-weight: bold !important;
`;

const Orange = styled.div`
	color: var(--orange) !important;
	font-weight: bold !important;
`;

const SValidators = styled.div``;

const stateStyling = (state: string) => {
	switch (state) {
		case 'Babbling':
			return <Green>Babbling</Green>;
		case 'Suspended':
			return <Orange>Suspended</Orange>;
		default:
			return state;
	}
};

type Props = {
	validators: Validator[];
	hideStatus?: boolean;
};

const Validators: React.FC<Props> = props => {
	const rendervalidators = () => {
		return props.validators.map(v => {
			const address = pubKeyToAddress(v.public_key);

			return (
				<tr key={v.moniker}>
					<td>
						<Link
							data-tip={`${v.moniker} - ${
								v.reachable ? 'Online' : 'False'
							}`}
							to={`/validator/${v.public_key}`}
						>
							<Avatar address={address} size={33} />
						</Link>
					</td>
					{!props.hideStatus && (
						<td>
							{v.reachable ? (
								<Image src={GREEN} width="12" />
							) : (
								<Image src={RED} width="12" />
							)}
						</td>
					)}

					<td>
						<b>{v.moniker}</b>
						<a
							data-tip={`http://${v.host}:8080/info`}
							target="_blank"
							href={`http://${v.host}:8080/info`}
						>
							<small className="mono d-block">{v.host}</small>
						</a>
					</td>
					<td className="mono">
						<Link
							data-tip={'View Address'}
							to={`/search/0x${address}`}
						>
							0x
							{address}
						</Link>
					</td>
					<td>{stateStyling(v.info.state)}</td>
					<td>{v.info.last_block_index}</td>
					<td>{v.info.last_consensus_round}</td>
					<td>{v.info.min_gas_price  / (10 ** 18) }</td>
					<td className="mono">
						{v.version.monetd && 'v'}
						{v.version.monetd}
					</td>
				</tr>
			);
		});
	};

	return (
		<SValidators>
			<Table>
				<thead>
					<tr>
						<th>Validator</th>
						{!props.hideStatus && <th>Service</th>}
						<th>Moniker</th>
						<th>Address</th>
						<th>State</th>
						<th>Latest Block</th>
						<th>Last Round</th>
						<th>Min Gas Price</th>
						<th>Version</th>
					</tr>
				</thead>
				<tbody>{rendervalidators()}</tbody>
				{/* {!props.hideStatus && (
					<tfoot>
						<tr>
							<td colSpan={9}>
								<Link to="/history">View History</Link>
							</td>
						</tr>
					</tfoot>
				)} */}
			</Table>
		</SValidators>
	);
};

export default Validators;
