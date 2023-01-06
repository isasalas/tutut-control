import React from 'react'
import {
    Divider, Box, IconButton, Typography, ListItemText, Unstable_Grid2 as Grid
} from '@mui/material';
import { SesionContext } from '../providers/SesionProvider';
import { MySvgControlGps, MySvgMinibus } from '../assets/mySvg';
import { NavigateNextRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { urlApi, urlLinea, urlUser } from '../api/myApiData';

const TrabajoScreen = () => {
    const { setSesion, sesion } = React.useContext(SesionContext)
    const [lineas, setLineas] = React.useState();
    const navigater = useNavigate();

    React.useEffect(() => {
        if (sesion.admin === true) {
            axios.get(urlApi + urlLinea)
                .then((response) => {
                    setLineas(response.data)
                });
        }
        else {
            axios.get(urlApi + urlUser + "/" + sesion.id)
                .then((res) => {
                    if (res.data.controls.length > 0) {
                        setLineas(res.data.controls.map((e) => { return e.linea }))
                    }
                });
        }
    }, [])

    React.useEffect(() => {
        if (sesion.linea) {
            navigater("/interno", { replace: true });
        }
    }, [sesion])

    const onClickLinea = (linea) => {
        const data = sesion;
        data.linea = linea;
        //data.linea = linea;
        window.localStorage.setItem('sesion', JSON.stringify(data))
        setSesion({ ...sesion, linea: linea });
    }


    if (!lineas) return <>cargando</>

    return (
        <Box sx={{ display: 'flex', p: 3, }}>
            <Grid sx={{ flexGrow: 1 }} container columnSpacing={3} >
                <Grid container paddingBottom={3} paddingTop={1} justifyContent="center" alignItems="center" columnSpacing={3} rowSpacing={0.5} xs={12}>
                    <Grid order={{ xs: 1, sm: 2 }} xs={6} sm={8} >
                        <Typography variant="h3"> <b>Lineas</b> </Typography>
                        <div style={{ fontSize: '15px' }} >
                            Escoge la linea con la que deseas trabajar
                        </div>
                    </Grid>
                    <Grid order={{ xs: 2, sm: 1 }} container xs={6} sm={4} maxWidth={200} >
                        <Grid xs={12} >
                            <MySvgControlGps />
                        </Grid>
                    </Grid>
                </Grid>
                {lineas.map((linea) => (
                    <Grid container key={linea.id} display="flex" justifyContent="space-between" alignItems="center" columnSpacing={2} xs={12} sm={6} md={4} lg={3} xl={2}>
                        <Grid xs={3} style={{ maxHeight: '50px', paddingLeft: '15px' }} >
                            <MySvgMinibus style={{ maxHeight: '50px' }} top={linea.color.top} bottom={linea.color.bottom} />
                        </Grid>
                        <Grid xs={8}>
                            <ListItemText primary={<Typography variant="h6">{linea.name}</Typography>} secondary={linea.id} />
                        </Grid>
                        <Grid xs={1} display="flex" justifyContent="center" alignItems="center" >
                            <IconButton aria-label="comment" onClick={(e) => { onClickLinea(linea) }}>
                                <NavigateNextRounded />
                            </IconButton>
                        </Grid>
                        <Grid xs={12}> <Divider variant="mind" /> </Grid>
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}
export default TrabajoScreen