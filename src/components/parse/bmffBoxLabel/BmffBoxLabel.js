import React from 'react';
import { Box, Typography } from '@mui/material';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { contentTypeUuidToText, bmffBoxTypeToText } from '../../utils/description';
import { styled } from '@mui/material/styles';
import './index.css';

function isJumbf(bmffBox) {
    return bmffBox['descriptionBox'];
}

const NoMaxWidthTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))({
    [`& .${tooltipClasses.tooltip}`]: {
        maxWidth: 'none',
    },
});

const BmffBoxLabel = (props) => {

    const { bmffNode } = props;

    const tooltipInfo = (isJumbf(bmffNode)) ?
        contentTypeUuidToText[bmffNode['descriptionBox']['uuid']] : bmffBoxTypeToText[bmffNode['type']];

    return (
        <Box className="bmffBoxLabel-container">
            <Typography className="bmffBoxLabel-typography">
                {bmffNode['type'] + " ( " + bmffNode['boxSize'] + " bytes ) "}
            </Typography>
            <NoMaxWidthTooltip className="bmffBoxLabel-tooltip" title={<Typography variant="h6">
                {tooltipInfo}
            </Typography>} placement="right">
                <InfoOutlinedIcon />
            </NoMaxWidthTooltip>
        </Box>
    );
}

export default BmffBoxLabel;
