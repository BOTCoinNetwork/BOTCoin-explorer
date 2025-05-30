import React, { useState } from 'react';
import utils from 'evm-lite-utils';
import styled from 'styled-components';
import Image from 'react-bootstrap/Image';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const SAvatar = styled(Image)`
    border-radius: 3px !important;
    margin-right: 10px;
    cursor: pointer;
`;

const StyledTooltip = styled(Tooltip)`
    .tooltip-inner {
        max-width: none;
        padding: 8px 12px;
        background-color: rgba(0, 0, 0, 0.85);
        font-size: 13px;
        user-select: text;
        &:hover {
            visibility: visible !important;
            opacity: 1 !important;
        }
    }
`;

type Props = {
    address: string;
    size?: number;
};

const Avatar: React.FC<Props> = props => {
    const [showTooltip, setShowTooltip] = useState(false);
    const cleanAddress = React.useMemo(() => {
        return utils.cleanAddress(props.address);
    }, [props.address]);

    return (
        <OverlayTrigger
            placement="auto"
            trigger={['hover']}
            defaultShow={false}
            overlay={
                <StyledTooltip 
                    id={`avatar-tooltip-${props.address}`}
                >
                    <div 
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                    >
                        {cleanAddress}
                    </div>
                </StyledTooltip>
            }
        >
            {/* src={`https://gravatar.com/avatar/${utils.trimHex(
                    props.address
                )}?size=100&default=retro`} */}
            <SAvatar
                src={`https://seccdn.libravatar.org/avatar/${utils.trimHex(
                    props.address
                )}?s=100&d=retro`}
                width={props.size || 50}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            />
        </OverlayTrigger>
    );
};

export default Avatar;
