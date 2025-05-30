import React from 'react';

import utils from 'evm-lite-utils';

import { Line, Rect } from 'react-konva';

import { pubKeyToAddress } from '../utils';

import { CONSTANTS, PeerNode } from '.';

type Props = {
	node: PeerNode;
};

const Node: React.FC<Props> = ({ node }) => {
	const address = pubKeyToAddress(node.publicKey);
	const img = new window.Image(40, 40);

	img.src = `https://seccdn.libravatar.org/avatar/${utils.trimHex(
		address
	)}?s=100&d=retro`;

	return (
		<>
			<Line
				points={[
					node.x + CONSTANTS.NODE_WIDTH / 2,
					node.y,
					node.x + CONSTANTS.NODE_WIDTH / 2,
					100 + node.eventsCount ** 2 * 70
				]}
				stroke={'bloack'}
				strokeEnabled={true}
				strokeWidth={1}
			/>
			<Rect
				fillPatternImage={img}
				fillPatternScaleX={CONSTANTS.NODE_WIDTH / 100}
				fillPatternScaleY={CONSTANTS.NODE_HEIGHT / 100}
				x={node.x}
				y={node.y}
				height={CONSTANTS.NODE_HEIGHT}
				width={CONSTANTS.NODE_WIDTH}
			/>
		</>
	);
};

export default Node;
