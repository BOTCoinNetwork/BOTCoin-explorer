import React from 'react';

import styled from 'styled-components';
import Media from 'react-bootstrap/Media';
import Avatar from './Avatar';

import { Block as TBlock } from '../client';
import { pubKeyToAddress } from '../utils';

const SBlock = styled.div`
	transition: background 0.2s ease-out;
	border-bottom: 1px solid #eee;
	/* padding-bottom: 5px; */
	display: block;
	padding: 15px 0;
	cursor: pointer;
	text-decoration: none !important;

	a:hover {
		text-decoration: none !important;
	}

	&.a:hover {
		background: #f9f9f9 !important;
		text-decoration: none !important;
	}

	.container-fluid {
		padding: 0 !important;
	}

	.active {
		background: var(--blue) !important;
		color: white !important;
		text-decoration: none !important;
	}

	.badge {
		/* background: var(--blue); */
		/* display: block !important; */
		/* margin: 5px; */
		/* border-radius: 0; */
		margin: 0;
		font-size: 12px;
		padding: 5px 7px;
	}
	.badge + .badge {
		margin: 5px;
	}
`;

const SBlockAvatar = styled.div`
	transition: background 0.2s ease-out;
	/* font-size: 15px; */
	background: #eee;
	padding: 20px 15px;
	border-radius: 5px !important;
	color: black !important;
	text-decoration: none !important;
	cursor: pointer;
	font-weight: 700;
	display: flex !important;
	text-align: center !important;
	height: 100%;
	font-size: 17px;
	font-family: Monet;
	align-items: center;
`;

const SStat = styled.div`
	transition: background 0.2s ease-out;
	/* font-size: 15px; */
	background: #fafafa;
	padding: 10px 10px;
	border: 1px solid #eee;
	border-radius: 5px !important;
	color: black !important;
	text-decoration: none !important;
	cursor: pointer;
	font-weight: 700;
	display: flex !important;
	text-align: center !important;
	height: 100%;
	font-size: 12px;
	align-items: center;
	text-transform: uppercase !important;
`;

const SAvatar = styled.div`
	margin: 1px;
	display: inline-block;
`;

type Props = {
	block: TBlock;
};

const Block: React.FC<Props> = ({ block }) => {
	return (
		<SBlock>
			<Media>
				<SBlockAvatar className="align-self-center mr-3">
					Block
				</SBlockAvatar>
				<Media.Body>
					<h5>Index {block.index}</h5>
					{/* <p className="mono">{block.state_hash}</p> */}
					<div className="mono">
						{block.signatures.map(s => (
							<SAvatar key={s.signature}>
								<Avatar
									address={pubKeyToAddress(
										s.validator.public_key
									)}
									size={30}
								/>
							</SAvatar>
						))}
					</div>
				</Media.Body>
				<SStat className="align-self-center mr-3">
					Tx: {block.transactions.length}
				</SStat>
				<SStat className="align-self-center mr-3">
					iTx: {block.internal_transactions.length}
				</SStat>
			</Media>
		</SBlock>
	);
};

export default Block;
