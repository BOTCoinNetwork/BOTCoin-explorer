import React, { useState } from 'react';
import styled from 'styled-components';

import { useSelector } from 'react-redux';
import {
	RouteComponentProps
} from 'react-router-dom';

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Jumbotron from '../components/Jumbotron';
import Stats from '../components/Stats';
import Validators from '../components/Validators';
import Transactions from '../components/Transactions';

import { SContent } from '../components/styles';
import {
	selectValidators
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

const SearchIcon = styled.span`
  display: flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  background-color: #e9ecef;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  border-left: 0;
  cursor: pointer;
  &:hover {
    background-color: #d1d7dc;
  }
`;

const Index: React.FC<RouteComponentProps<{}>> = (props) => {
	const validators = useSelector(selectValidators);
	const [search, setSearch] = useState('');
	
	const onSearchEnter = (event: any) => {
		if (event.keyCode === 13) {
			props.history.push(`/search/${search}`);
		}
	};

	const onSearchClick = () => {
		if (search) {
			props.history.push(`/search/${search}`);
		}
	};

	return (
		<>
			<Jumbotron />
			<Section padding={30}>
				<Grid>
					<Quadrant pos={[1, 1]}>
						<InputGroup>
							<Form.Control
								value={search}
								onChange={(e: any) => setSearch(e.target.value)}
								onKeyUp={onSearchEnter}
								type="search"
								placeholder="Search Address"
							/>
							<InputGroup.Append>
								<SearchIcon onClick={onSearchClick}>
									<svg width="16" height="16" viewBox="0 0 16 16">
										<path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
									</svg>
								</SearchIcon>
							</InputGroup.Append>
						</InputGroup>
					</Quadrant>
				</Grid>
			</Section>
			<Stats />
			<Transactions />
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
