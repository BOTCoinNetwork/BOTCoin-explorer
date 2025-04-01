import React, { useState } from 'react';

import utils from 'evm-lite-utils';
import ReCAPTCHA from 'react-google-recaptcha';
import styled from 'styled-components';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import Loader from './Loader';

import ExplorerAPIClient from '../client';
import CoreAPI from '../client';

const SError = styled.div`
	color: #ff0000;
	display: inline-block;
	margin-left: 5px;
`;

const SSuccess = styled.div`
	color: white;
	font-size: 35px;
	text-align: center;
`;

const Faucet: React.FC<{}> = () => {
	const c = new CoreAPI();

	const [loading, setLoading] = useState(false);
	const [recaptcha, setRecaptcha] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [address, setAddress] = useState('');

	function onChange() {
		setRecaptcha(true);
	}

	const onSubmit = async () => {
		setError('');
		setLoading(true);

		if (utils.cleanAddress(address).length !== 42) {
			setError('Invalid address');
			setLoading(false);
			return;
		}

		if (recaptcha) {
			try {
				const data = await c.submitFaucetTx(
					utils.cleanAddress(address)
				);

				if (data.status === 1) {
					setSuccess(`We've transferred you 100 Tenom!`);
				} else {
					setError('Something went wrong. Please try again later.');
				}
			} catch (e) {
				throw e;
			}
		} else {
			setError('Must complete the ReCAPTCHA!');
		}

		setLoading(false);
	};

	return (
		<Form>
			{success.length ? (
				<Form.Group>
					<SSuccess>{success}</SSuccess>
				</Form.Group>
			) : (
				<>
					<Form.Group controlId="exampleForm.ControlInput1">
						<Form.Label>Address</Form.Label>
						<Form.Control
							onChange={(e: any) => setAddress(e.target.value)}
							type="text"
							placeholder="Enter your address"
						/>
					</Form.Group>
					<Form.Group>
						<ReCAPTCHA
							type="image"
							onChange={onChange}
							theme={'light'}
							sitekey="6LfIIgYrAAAAAK5xB5UJ1VSno9_BPSrWFx97trdA"
						/>
					</Form.Group>
					<Form.Group>
						<Button
							disabled={loading}
							onClick={onSubmit}
							variant="warning"
							className="bigger"
						>
							Receive Tokens
						</Button>{' '}
						<SError>{error}</SError>{' '}
						<Loader loading={loading} size={50} />
					</Form.Group>
				</>
			)}
		</Form>
	);
};

export default Faucet;
