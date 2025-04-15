import React from 'react';
import styled from 'styled-components';

import { useSelector } from 'react-redux';
import { 
	RouteComponentProps, 
	// Link 
} from 'react-router-dom';

import Jumbotron from '../components/Jumbotron';
// import Nominees from '../components/Nominees';
import Stats from '../components/Stats';
import Validators from '../components/Validators';
// import Whitelist from '../components/Whitelist';
import Blocks from '../components/Blocks';

// import History from '../containers/History';

import { SContent } from '../components/styles';
import {
	// selectNominees,
	selectValidators,
	// selectWhitelist
} from '../selectors';

import Grid, { Quadrant, Section } from '../ui';

const SValidators = styled.div`
	background: #fff;
	border-top: 1px solid #eee;
`;

// const SWhitelist = styled.div`
// 	background: #fff;
// 	border-top: 1px solid #eee;
// `;

const Index: React.FC<RouteComponentProps<{}>> = props => {
	const validators = useSelector(selectValidators);
	// const nominees = useSelector(selectNominees);
	// const whitelist = useSelector(selectWhitelist);

	return (
		<>
			<Jumbotron />
			<Stats />
			<Blocks />
			<SValidators>
				<Section>
					<Grid>
						<Quadrant pos={[1, 1]} xs={12}>
							<SContent>
								<h3>Current Validators</h3>
								<Validators validators={validators} />
							</SContent>
						</Quadrant>
					</Grid>
				</Section>
			</SValidators>
			{/* <SWhitelist>
				<Section padding={50}>
					<Grid verticalAlign={false}>
						<Quadrant pos={[1, 1]} xs={12} md={12} lg={6} xl={6}>
							<SContent>
								<h3>Whitelist</h3>
								<br />
								<Whitelist whitelist={whitelist} />
							</SContent>
						</Quadrant>
						<Quadrant pos={[1, 2]} xs={12} md={12} lg={6} xl={6}>
							<SContent>
								<h3>Nominees</h3>
								<br />
								<Nominees nominees={nominees} />
							</SContent>
						</Quadrant>
					</Grid>
				</Section>
			</SWhitelist> */}
		</>
	);
};

export default Index;
