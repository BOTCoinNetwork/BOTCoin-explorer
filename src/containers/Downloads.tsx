import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Media from 'react-bootstrap/Media';
import Row from 'react-bootstrap/Row';

import { SContent, SJumbotron, SSection } from '../components/styles';

import { Application, DownloadsAPI } from '../client';
import { Section } from '../ui';
import { capitalize } from '../utils';

const SContainer = styled.div`
	.card {
		margin-bottom: 20px !important;
		padding: 20px !important;
	}
	a.card-link {
		background: var(--orange) !important;
		color: white !important;
		font-weight: 600 !important;
		background: red;
		padding: 6px 10px;
		border-radius: 5px;
	}
	.card-link + .card-link {
		margin-left: 10px;
	}
	.card-title {
		font-size: 25px;
		margin-bottom: 20px !important;
	}
`;

const SBox = styled.div`
	background: #fff !important;
	padding: 20px;
	border-radius: 3px;
	/* border: 1px solid #eee; */
`;

const Transactions: React.FC<{}> = () => {
	const c = new DownloadsAPI();

	const [os] = useState(['Android', 'iOS']);
	const [applications, setApplications] = useState<Application[]>([]);

	const fetchApps = async () => {
		setApplications(await c.getApplications());
	};

	useEffect(() => {
		fetchApps();
	}, []);

	const parseAppName = (name: string) => {
		switch (name) {
			case 'monetd':
				return 'Monet Daemon';
			case 'monetcli':
				return 'Monet CLI';
			case 'monet-wallet':
				return 'Monet Wallet';
			default:
				return name;
		}
	};

	return (
		<SContainer>
			<SJumbotron>
				<Section padding={30}>
					<Container>
						<Row className="align-items-center">
							<Col>
								<h1>Downloads</h1>
								<p>
									Browse latest versions of the Botcoin Network
								</p>
							</Col>
						</Row>
					</Container>
				</Section>
			</SJumbotron>
			<SSection>
				<Container>
					<Row>
						{applications.map((app, i) => (
							<Col md={6} key={i}>
								{app.repository_name === 'monet-wallet' && (
									<>
										<br />
										<br />
									</>
								)}
								<SContent>
									<h3>{parseAppName(app.repository_name)}</h3>
									<SBox>
										<Media>
											<a
												href={`https://github.com/BOTCoinNetwork/${app.repository_name}/`}
											>
												<img
													src={
														app.repository_name ===
														'Wallet_app'
															? 'https://explorer.BOTCoin.Network/logo.png'
															: 'https://image.flaticon.com/icons/svg/919/919847.svg'
													}
													width={54}
													height={54}
													className="text-center mr-4"
												/>
											</a>
											<Media.Body>
												<h5 className="mr-4">
													{parseAppName(
														app.repository_name
													)}{' '}
													<Badge
														as="div"
														variant="secondary"
													>
														Latest
													</Badge>
												</h5>
												<p className="text-muted mono">
													{app.repository_name}
												</p>
												<p
													dangerouslySetInnerHTML={{
														__html: app.description
													}}
												/>
												<hr />
												<p>
													{os.map((o, i) => (
														<Button
															href={o == "Android" ? `https://explorer.BOTCoin.Network/${app.repository_name}/Wallet_Android-release.apk`: `/api/downloads/${app.repository_name}/?os=${o}`}
															key={`${o}/${i}`}
															className="mr-1"
															variant="primary"
														>
															{capitalize(o)}
														</Button>
													))}
												</p>
											</Media.Body>
										</Media>
									</SBox>
									<div className="d-xs-block d-md-none">
										<hr />
										<br />
									</div>
								</SContent>
							</Col>
						))}
					</Row>
				</Container>
			</SSection>
		</SContainer>
	);
};

export default Transactions;
