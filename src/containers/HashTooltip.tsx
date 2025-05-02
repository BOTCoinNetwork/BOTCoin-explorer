import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { Overlay, Tooltip } from 'react-bootstrap';

const HashSpan = styled.span`
    cursor: pointer;
    color: rgb(16, 72, 135);
`;

const CopyButton = styled.button`
    margin-left: 10px;
    padding: 2px 18px;
    border: none;
    background: rgb(16, 54, 95);
    color: white;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    &:hover {
        background: rgb(28, 90, 155);
    }
`;

interface HashTooltipProps {
    hash: string;
}

const shortenHash = (hash: string) => {
    if (!hash) return '';
    return `${hash.substring(0, 10)}......${hash.substring(hash.length - 10)}`;
};

export const HashTooltip: React.FC<HashTooltipProps> = ({ hash }) => {
    const [showTooltip, setShowTooltip] = useState<boolean>(false);
    const [targetRef, setTargetRef] = useState<HTMLElement | null>(null);
    const [copySuccess, setCopySuccess] = useState<boolean>(false);

    const handleHashClick = useCallback((event: React.MouseEvent<HTMLSpanElement>) => {
        setTargetRef(event.currentTarget);
        setShowTooltip(!showTooltip);
    }, [showTooltip]);

    const handleCopy = useCallback((text: string) => {
        navigator.clipboard.writeText(text);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    }, []);

    return (
        <>
            <HashSpan onClick={handleHashClick}>
                {shortenHash(hash)}
            </HashSpan>
            {targetRef && (
                <Overlay
                    show={showTooltip}
                    target={targetRef}
                    placement="top"
                    rootClose={true}
                    onHide={() => setShowTooltip(false)}
                >
                    <Tooltip id={`tooltip-${hash}`}>
                        <div>
                            {hash}
                            <CopyButton onClick={() => handleCopy(hash)}>
                                {copySuccess ? 'copyed!' : 'copy'}
                            </CopyButton>
                        </div>
                    </Tooltip>
                </Overlay>
            )}
        </>
    );
};

export default HashTooltip;