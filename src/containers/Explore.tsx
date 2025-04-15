import React, { useState } from 'react';

import { Link, RouteComponentProps } from 'react-router-dom';

import styled from 'styled-components';

import Form from 'react-bootstrap/Form';

import Stats from '../components/Stats';
import Transactions from '../components/Transactions';

import { SJumbotron } from '../components/styles';

import Grid, { Quadrant, Section } from '../ui';

const Explore: React.FC<RouteComponentProps<{}>> = (props) => {
	const [search, setSearch] = useState('');
	const onSearchEnter = (event: any) => {
		if (event.keyCode === 13) {
			props.history.push(`/search/${search}`);
		}
	};

	return (
		<>
			<SJumbotron>
				<Section padding={30}>
					<Grid>
						<Quadrant pos={[1, 1]}>
							<h1>Explore</h1>
							<p className="">
								Browse blocks and transactions
								{/* and the{' '}
								<a href="https://github.com/mosaicnetworks/babble">
									Babble
								</a>{' '}
								hashgraph */}
							</p>
							<Form.Control
								onChange={(e: any) => setSearch(e.target.value)}
								onKeyUp={onSearchEnter}
								type="text"
								placeholder="Search Address"
							/>
						</Quadrant>
					</Grid>
				</Section>
			</SJumbotron>
			<Stats />
			<Transactions />
		</>
	);
};

export default Explore;
