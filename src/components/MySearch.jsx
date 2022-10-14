import { Box, Button, TextField, Typography, Unstable_Grid2 as Grid } from '@mui/material'
import React from 'react'
import PropTypes from 'prop-types';
import {
    SearchRounded as SearchRoundedIcon
} from '@mui/icons-material'

export const MySearchName = (props) => {
    const setSearchData = props.setSearchData;
    const searchData = props.searchData;
    return (
        <Box sx={{ pb: 1, display: 'flex', alignItems: 'flex-end' }}>
            <SearchRoundedIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            <TextField

                label="Buscar"
                
                variant="standard"
                onChange={(e) => { setSearchData({ ...searchData, name: e.target.value }) }}
            />
        </Box>
    )
}

MySearchName.propTypes = {
    setSearchData: PropTypes.func.isRequired,
    searchData: PropTypes.object.isRequired,
};

