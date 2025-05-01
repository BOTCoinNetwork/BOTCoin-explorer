import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';

import Stats from '../components/Stats';
import Blocks from '../components/Blocks';

import { SJumbotron } from '../components/styles';

import Grid, { Quadrant, Section } from '../ui';

const Explore: React.FC<RouteComponentProps<{}>> = (props) => {
	return (
		<>
			<SJumbotron>
				<Section padding={30}>
					<Grid>
						<Quadrant pos={[1, 1]}>
							<h1>Blocks</h1>
							<p className="">
								Browse blocks and transactions
							</p>
						</Quadrant>
					</Grid>
				</Section>
			</SJumbotron>
			<Stats />
			<Blocks />
		</>
	);
};

export default Explore;
