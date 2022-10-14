import React from 'react'
import {
    Divider,
    Box,
    Button,
    IconButton,
    ListItemIcon,
    Typography,
    ListItemText,
    TextField,
    MenuItem,
    Menu,
    Dialog,
    DialogTitle,
    DialogContentText,
    DialogContent,
    DialogActions,
    Unstable_Grid2 as Grid
} from '@mui/material';
import { SesionContext } from '../providers/SesionProvider';
import { MySvgControlGps, MySvgMinibus } from '../assets/mySvg';
import { MoreVertRounded, NavigateNextRounded } from '@mui/icons-material';
import { MyBanner } from '../components/myBanner';
import { LineaContext } from '../providers/LineaProvider';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { urlApi, urlLinea, urlUser } from '../api/myApiData';

const DashboardScreen = () => {

    const { setSesion, sesion } = React.useContext(SesionContext)
    const [reload, setReload] = React.useState();

    const navigater = useNavigate();
    const { setLinea, linea } = React.useContext(LineaContext)

    React.useEffect(() => {
        if (sesion.roleId === "1") {
            axios.get(urlApi + urlLinea)
                .then((responseLineas) => {
                    setSesion({ ...sesion, trabajos: responseLineas.data })
                });
        }
        else {
            axios.get(urlApi + urlUser + "/" + sesion.id)
                .then((responseUser) => {
                    var objet = responseUser.data;
                    objet.trabajos =
                        responseUser.data.trabajos.map((item) => { return item.linea })
                    setSesion({ ...sesion, trabajos: objet.trabajos })
                })
        }



        if (linea) {
            console.log(linea);
            navigater("/interno", { replace: true });
            /*if (sesion.roleId === "1") { }
            else {
                console.log(sesion)
                navigater("/interno", { replace: true });
            }*/
        }

    }, [linea])

    return (
        <Box sx={{
            display: 'flex',
            p: 3,
        }}>
            <Grid
                sx={{ flexGrow: 1 }}
                container
                columnSpacing={3}
            >
                <Grid container
                    paddingBottom={3}
                    paddingTop={1}
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    columnSpacing={3}
                    rowSpacing={0.5}
                    xs={12}>
                    <Grid order={{ xs: 1, sm: 2 }}
                        xs={6}
                        sm={8}
                    >
                        <Typography variant="h3">
                            <b>Lineas</b>
                        </Typography>
                        <div style={{ fontSize: '15px' }} >
                            Escoge la linea
                        </div>

                    </Grid>
                    <Grid order={{ xs: 2, sm: 1 }} container
                        xs={6}
                        sm={4}
                        maxWidth={200} >
                        <Grid xs={12} >
                            <MySvgControlGps />
                        </Grid>
                    </Grid>
                </Grid>
                {sesion.trabajos.map((linea) => (
                    <Grid container
                        key={linea.id}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        columnSpacing={2}
                        xs={12} sm={6} md={4} lg={3} xl={2}>

                        <Grid xs={3} style={{ maxHeight: '50px', paddingLeft: '15px' }}>
                            <MySvgMinibus
                                style={{ maxHeight: '50px' }}
                                colorpr={linea.colorPr}
                                colorbg={linea.colorBg} />
                        </Grid>

                        <Grid xs={8}>
                            <ListItemText
                                primary={<Typography variant="h6">{linea.name}</Typography>}
                                secondary={linea.id} />
                        </Grid>

                        <Grid xs={1} display="flex" justifyContent="center" alignItems="center">
                            <IconButton aria-label="comment" onClick={() => {
                                setLinea(linea);
                            }}>
                                <NavigateNextRounded />
                            </IconButton>

                        </Grid>
                        <Grid xs={12}>
                            <Divider variant="mind" />
                        </Grid>
                    </Grid>
                ))}
            </Grid>

        </Box>
    )
}

export default DashboardScreen