import { Box, Button, TextField, Typography, Unstable_Grid2 as Grid } from '@mui/material'
import { GoogleMap, MarkerF } from '@react-google-maps/api'
import axios from 'axios'
import { MuiColorInput } from 'mui-color-input'
import { useSnackbar } from 'notistack'
import React from 'react'
import { urlApi, urlLinea } from '../api/myApiData'
import { MyStyleDarkMap } from '../assets/maps/myStyleMap'
import { MySvgMinibus } from '../assets/mySvg'
import MiniDrawer from '../components/mydrawer'
import { LineaModelJson } from '../models/models'
import { SesionContext } from '../providers/SesionProvider'

const PerfilLineaScreen = () => {
    const { setSesion, sesion } = React.useContext(SesionContext)
    const [linea, setLinea] = React.useState(LineaModelJson);

    const { enqueueSnackbar } = useSnackbar();

    React.useEffect(() => {
        axios.get(urlApi + urlLinea + "/" + sesion.linea.id)
            .then((response) => { setLinea(response.data); })
    }, [])

    const guardarCambios = () => {
        if (!linea.name || !linea.phone || !linea.color.bottom || !linea.color.top || !linea.direction.lat || !linea.direction.lng) {
            return enqueueSnackbar("Introduzca todos los datos", { variant: 'error' });
        }
        axios.put(urlApi + urlLinea + '/' + linea.id, linea)
            .then((response) => {
                setSesion({ ...sesion, linea: response.data })
                const loginSesion = JSON.parse(window.localStorage.getItem('sesion'));
                loginSesion.linea = response.dat
                window.localStorage.setItem('sesion', JSON.stringify(loginSesion))
                enqueueSnackbar(linea.name + " editado con exito", { variant: 'success' });
            })
            .catch((e) => { enqueueSnackbar(JSON.stringify(e.message), { variant: 'error' }); });
    }

    return (
        <MiniDrawer Contend={
            !linea.id ? <>Cargando...</> :
                <Box display="flex" justifyContent="center" textAlign='center'>
                    <Grid maxWidth={1000} flex={1} alignContent='center' container justifyContent="space-evenly" alignItems="center" spacing={2}>
                        <Grid container xs={12} >
                            <Grid xs={12}>
                                {/*<Typography variant="h3"> <b>{linea.name}</b> </Typography>*/}
                                <div style={{ fontSize: '15px', color:'lightgray' }} >
                                    Edita el nombre, telefono, colores y direccion de la linea
                                </div>
                            </Grid>
                            <Grid container xs={12} md={6}>
                                <Grid xs={4} >
                                    <TextField disabled fullWidth label="Id" variant="standard" value={linea.id} />
                                </Grid>
                                <Grid xs={8} >
                                    <TextField fullWidth label="Nombre" variant="standard" value={linea.name} onChange={e => setLinea({ ...linea, name: e.target.value })} />
                                </Grid>
                                <Grid xs={12} >
                                    <TextField fullWidth label="Telefono" variant="standard" value={linea.phone} onChange={e => setLinea({ ...linea, phone: e.target.value })} />
                                </Grid>
                            </Grid>
                            <Grid container xs={12} md={6}>
                                <Grid container justifyContent="space-evenly" alignItems="center" maxWidth={200} xs={6} sm={6}  >
                                    <Grid xs={12} >
                                        <MySvgMinibus bottom={linea.color.bottom} top={linea.color.top} />
                                    </Grid>

                                </Grid>
                                <Grid container xs={6} >
                                    <Grid xs={12} >
                                        <MuiColorInput fullWidth label="Color Superior" variant="standard" format="hex" value={'#' + linea.color.bottom}
                                            onChange={(color, colors) => {
                                                setLinea({ ...linea, color: { top: linea.color.top, bottom: colors.hex.slice(1) } });
                                            }} />
                                    </Grid>
                                    <Grid xs={12} >
                                        <MuiColorInput fullWidth label="Color Inferior" variant="standard" format="hex" value={'#' + linea.color.top}
                                            onChange={(color, colors) => {
                                                setLinea({ ...linea, color: { top: colors.hex.slice(1), bottom: linea.color.bottom } });
                                            }} />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid xs={12}  >
                            Dirección:
                            <GoogleMap
                                mapContainerStyle={{ width: '100%', height: '235px' }}
                                zoom={15}
                                options={{ mapTypeControl: false, styles: MyStyleDarkMap }}
                                center={{ lat: Number.parseFloat(linea.direction.lat), lng: Number.parseFloat(linea.direction.lng) }}
                                onClick={(e) => { setLinea({ ...linea, direction: { lat: e.latLng.lat(), lng: e.latLng.lng() } }); }} >
                                <MarkerF position={{ lat: Number.parseFloat(linea.direction.lat), lng: Number.parseFloat(linea.direction.lng) }} />
                            </GoogleMap>

                        </Grid>
                        <Grid xs={12} >
                            <Button fullWidth children={"guardar cambios"} variant="contained"
                                onClick={guardarCambios} />
                        </Grid>
                    </Grid>

                </Box>
        }></MiniDrawer>
    )
}
export default PerfilLineaScreen