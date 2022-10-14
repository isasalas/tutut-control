import { Button, Typography, Unstable_Grid2 as Grid } from '@mui/material'
import React from 'react'
import PropTypes from 'prop-types';




export const MyBanner = (props) => {

    const handleClickOpenDialogCreate = props.OpenDialogCreate;
    const MySvg = props.MySvg;
    const MyTitle= props.MyTitle;
    const MyDescription= props.MyDescription;
    const MyBuutonText= props.MyBuutonText;
    return (

        <Grid container
            paddingBottom={3}
            paddingTop={1}
            direction="row"
            justifyContent="space-evenly"
            alignItems="center"
            columnSpacing={3}
            rowSpacing={0.5}>
            <Grid container
                xs={12}
                sm={4}
                maxWidth={200} >
                <Grid xs={12} >
                    {MySvg}
                </Grid>
            </Grid>
            <Grid xs={12} sm={8}>
                <Typography variant="h3">
                    <b>{MyTitle}</b>
                </Typography>
                <div style={{ fontSize: '15px' }} >
                    {MyDescription}
                </div>
                <br></br>
                <Button variant="contained"
                    //to="/User"
                    onClick={handleClickOpenDialogCreate('paper')}
                >
                    {MyBuutonText}
                </Button>
            </Grid>
        </Grid>

    )
}

MyBanner.propTypes = {
    OpenDialogCreate: PropTypes.func.isRequired,
    MySvg: PropTypes.object.isRequired,
    MyTitle: PropTypes.string.isRequired,
    MyDescription: PropTypes.string.isRequired,
    MyBuutonText: PropTypes.string.isRequired,
};

