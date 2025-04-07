import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import styled, { ThemeProvider } from 'styled-components';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import { DEV } from '../const';
import {
	fetchAll,
	selectNetwork as selectNetworkAction
} from '../modules/dashboard';
import { selectAllNetworks, selectNetwork } from '../selectors';

import BOTCoin_logo from '../assets/logo.png';
const SIcon = styled(Image)`
	margin-bottom: 10px;
`;

const SNavbar = styled(Navbar)`
	transition: background 0.3s cubic-bezier(1, 1, 1, 1);
	border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;

	&.bg-dark {
		background: linear-gradient(93deg, #1c3f94, #152c60) !important;
		color: white !important;
		/* border-bottom: 1px solid #f4f4f4; */
		/* margin-bottom: 30px !important; */
	}

	${props =>
		props.theme.enable &&
		`
		&.bg-dark {
			background: rgba(255, 255, 255, 0.9) !important;
			color: black !important;
		}
	`}

	${props =>
		props.theme.enable &&
		`
		border-bottom: 1px solid rgba(0, 0, 0 , 0.05) !important;
		box-shadow: 0 1px 50px rgba(0, 0, 0, 0.05) !important;
		`}

	#dropdownn {
		color: #fff !important;
	}

	.c {
		font-family: monospace !important;
		color: #ccc !important;
	}
`;

const SBrand = styled(Navbar.Brand)`
	font-size: 28px !important;
	font-family: PixelGamerFont !important;
	letter-spacing: 4px;

	a {
		color: #fff !important;
		${props =>
			props.theme.enable &&
			`
	color: #000 !important;
	`}
	}

	a:hover {
		text-decoration: none !important;
	}
`;

const SNetwork = styled.span`
	color: #fff;
	text-transform: capitalize;
	font-weight: 700 !important;
	font-size: 18px;
	${props =>
		props.theme.enable &&
		`
	color: #000 !important;
	`}

	small {
		text-transform: none !important;
	}
`;

const SNav = styled(Nav)`
	.nav-link a {
		color: #eee !important;

		${props =>
			props.theme.enable &&
			`
	color: #222 !important;
	`}
		font-weight: 600 !important;
	}
	.nav-link {
		color: #222 !important;
	}

	.nav-link a:hover {
		color: var(--orange) !important;
		text-decoration: none;
	}
`;

const SSearch = styled.div`
	margin-left: 10px;

	@media (max-width: 575px) {
		margin-left: 0;
		width: auto !important;
		margin: 10px 0;
	}

	& input {
		font-size: 14px;
		border: none !important;
		color: #222 !important;
		background: rgba(60, 120, 208, 0.1) !important;
	}

	& input::placeholder {
		color: #666;
	}
`;

const Header: React.FC<{}> = () => {
	const dispatch = useDispatch();

	const scrollToggleHeight = 10;
	const [stickyHeader, setStickyHeader] = useState(false);

	const [search, setSearch] = useState('');

	const networks = useSelector(selectAllNetworks);
	const selected = useSelector(selectNetwork);

	const fetchAllData = () => dispatch(fetchAll());

	let interval: any;

	useEffect(() => {
		if (!DEV) {
			interval = setInterval(() => {
				fetchAllData();
				console.log('(5s) Fetching data...');
			}, 5000);
		}

		window.addEventListener('scroll', () => {
			if (window.scrollY > scrollToggleHeight) {
				setStickyHeader(true);
			}

			if (window.scrollY <= scrollToggleHeight) {
				setStickyHeader(false);
			}
		});

		return () => {
			clearInterval(interval);
		};
	}, []);

	useEffect(() => {
		if (networks.length) {
			dispatch(selectNetworkAction(networks[0].name));
		}
	}, [networks]);

	const theme = {
		enable: stickyHeader
	};

	return (
		<ThemeProvider theme={theme}>
			<SNavbar
				bg={'dark'}
				expand="lg"
				variant="dark"
				className="justify-content-between"
				sticky={'top'}
			>
				<Container fluid={false}>
					<SIcon src={BOTCoin_logo} width={'50'} />
					<SBrand>
						{
							<Link to={'/'}>
								<span>BOTCoin</span>
							</Link>
						}
					</SBrand>
					{/* <SNetwork>
						{selected && selected.name.split('-')[0]} v
						{selected && selected.name.split('-')[1]}
					</SNetwork> */}
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse
						id="basic-navbar-nav"
						className="justify-content-end"
					>
						<SNav activeKey="/">
							{/* <Nav.Item>
								<Nav.Link as="span" eventKey="link-2">
									<Link to={'/'}>Dashboard</Link>
								</Nav.Link>
							</Nav.Item> */}
							<Nav.Item>
								<Nav.Link as="span">
									<Link to={'/downloads'}>Downloads</Link>
								</Nav.Link>
							</Nav.Item>
							{/* <NavDropdown title="Networks" id="dropdownn">
								{networks.map(n => (
									<NavDropdown.Item
										onClick={onClickNetworkBind(n.id)}
										key={n.id}
										href="#"
									>
										{n.name}
									</NavDropdown.Item>
								))}
							</NavDropdown> */}
						</SNav>

						<SSearch className="justify-content-end">
							{/* <Form.Control
								type="text"
								placeholder="Search"
								onChange={(e: any) => setSearch(e.target.value)}
								onKeyDown={(ev: any) => {
									if (ev.key === 'Enter') {
										window.location.href =
											'/search/' + search;
										ev.preventDefault();
									}
								}}
								className="mr-sm-2"
							/> */}
							<Link to={'/blocks'}>
								<Button
									variant={
										stickyHeader
											? 'primary'
											: 'outline-light'
									}
									className="bigger"
								>
									Explore
								</Button>
							</Link>
						</SSearch>
					</Navbar.Collapse>
				</Container>
			</SNavbar>
		</ThemeProvider>
	);
};

export default Header;
