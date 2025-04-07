import React from 'react';
import styled from 'styled-components';

import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';

import Faucet from '../components/Faucet';

import { selectNetwork } from '../selectors';
import { capitalize } from '../utils';

import BG from '../assets/bg.png';
import BOTCoin_ICON from '../assets/icon.png';

const SIcon = styled(Image)`
	margin-bottom: 20px;
`;

const SAlert = styled(Alert)`
	padding: 50px 0px !important;
	background: url(${BG}) !important;
	background-size: cover !important;
	background-position-y: -10px !important;
	color: #eee !important;
	border: none !important;
	box-shadow: none !important;
	margin-bottom: 0px !important;
	border-radius: 0 !important;

	.alert-heading {
		margin-top: 0px !important;
	}

	& input {
		font-size: 14px;
		border: none !important;
		color: #fff !important;
		background: rgba(60, 120, 208, 0.3) !important;
	}

	& input::placeholder {
		color: #888;
	}

	a {
		color: #f26630 !important;
		font-weight: bold;
	}

	p {
		padding: 10px 0;
		font-weight: 500;
	}
`;

const Jumbotron: React.FC<{}> = () => {
	const selected = useSelector(selectNetwork);

	return (
		<>
			<SAlert variant="info">
				<Container>
					<Row className="align-items-center">
						<Col xs={12} md={5}>
							<SIcon src={BOTCoin_ICON} width={'100'} />
							<Alert.Heading as="h1">
								BOTCoin Testnet{' '}
								{/* {capitalize(
									(selected && selected.name.split('-')[0]) ||
										'None'
								)}{' '}
								v{selected && selected.name.split('-')[1]} */}
							</Alert.Heading>
							<p>
								Use our <Link to={'/downloads'}>Wallet</Link> to
								generate a key and fill the faucet form to
								automatically receive 100 BOC on the testnet.
							</p>
							<p>
								<a
									href="https://github.com/BOTCoinNetwork/"
									target="_blank"
								>
									<Button
										variant="outline-light"
										className="bigger"
									>
										Github
									</Button>
								</a>
							</p>
						</Col>
						<Col xs={12} md={5}>
							<Faucet />
						</Col>
						<Col md={2} className="d-none d-sm-block text-center">
							<Image
								src="https://monet.network/app/images/products/tenom.svg"
								width={150}
							/>
						</Col>
					</Row>
				</Container>
			</SAlert>
		</>
	);
};

export default Jumbotron;
