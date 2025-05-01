import styled from 'styled-components';

import Table from 'react-bootstrap/Table';

export const SContent = styled.div`
	h3 {
		font-size: 16px;
		margin-bottom: 10px;
		font-weight: 800;
		text-transform: uppercase;
	}

	.v-center {
		display: flex;
		align-items: center;
	}

	.white {
		background: white !important;
		padding: 10px;
	}
`;

export const STable = styled(Table)`
	background: white !important;
	border-radius: 3px !important;

	td {
		/* padding: 15px 10px !important; */

		a {
			color: #444 !important;
			text-decoration: none !important;
		}

		a:hover {
			color: #000 !important;
		}
	}

	tfoot {
		text-align: center;
		font-weight: 700;
		border-bottom: 1px solid #EEE;
		background: #fafafa;
		font-size: 13px;

		td {
			padding: 10px 0 !important;
			border-radius: 3px !important;
		}
	}
`;

export const SJumbotron = styled.div`
	padding: 0px 0px !important;
	background: #fff !important;
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
`;

export const SSection = styled.div`
	margin-top: 50px;
`;
