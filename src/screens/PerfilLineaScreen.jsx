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
    const [linea, setLinea] = React.useState({
        id: null,
        name: null,
        description: null,
        direction: { lat: -17.783957, lng: -63.181132 },
        color: { top: 'ffffff', bottom: '3c3c3c' },
        phone: null
    });

    const { enqueueSnackbar } = useSnackbar();

    React.useEffect(()=>{
        axios.get(urlApi + urlLinea + "/" + sesion.lineaId)
        .then((response) => { setLinea(response.data); })
    },[])

    return (
        <MiniDrawer Contend={
            !linea.id? <>Cargando...</>:
            <Box >
                <Box >
                    <Grid container paddingY={1} justifyContent="space-evenly" alignItems="center" spacing={2}>
                        <Grid container xs={12} sm={6} >
                            <Grid xs={12}>
                                <Typography variant="h3"> <b>{linea.name}</b> </Typography>
                                <div style={{ fontSize: '15px' }} >
                                    Edita el id, nombre, telefono, descripticion, colores y direccion de la nueva linea
                                </div>
                            </Grid>
                            <Grid xs={4} >
                                <TextField disabled fullWidth label="Id" variant="standard" value={linea.id} />
                            </Grid>
                            <Grid xs={8} >
                                <TextField fullWidth label="Nombre" variant="standard" value={linea.name} onChange={e => setLinea({ ...linea, name: e.target.value })} />
                            </Grid>
                            <Grid xs={12} >
                                <TextField fullWidth label="Telefono" variant="standard" value={linea.phone} onChange={e => setLinea({ ...linea, phone: e.target.value })} />
                            </Grid>
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

                        <Grid xs={12} sm={6} >
                            direccion:
                            <GoogleMap
                                mapContainerStyle={{ width: '100%', height: '350px' }}
                                zoom={15}
                                options={{ mapTypeControl: false, streetViewControl: false, styles: MyStyleDarkMap }}
                                center={{ lat: Number.parseFloat(linea.direction.lat), lng: Number.parseFloat(linea.direction.lng) }}
                                onClick={(e) => { setLinea({ ...linea, direction: { lat: e.latLng.lat(), lng: e.latLng.lng() } }); }} >
                                <MarkerF position={{ lat: Number.parseFloat(linea.direction.lat), lng: Number.parseFloat(linea.direction.lng) }} />
                            </GoogleMap>
                            <Button sx={{ m: '10px' }} variant="contained"
                                onClick={() => {
                                    if (!linea.name || !linea.phone || !linea.color.bottom || !linea.color.top || !linea.direction.lat || !linea.direction.lng) {
                                        return enqueueSnackbar("Introduzca todos los datos", { variant: 'error' });
                                    }
                                    axios.put(urlApi + urlLinea + '/' + linea.id, linea)
                                        .then((response) => {
                                            setSesion({ ...sesion, linea: response.data, lineaId: response.data.id })
                                            enqueueSnackbar(linea.name + " editado con exito", { variant: 'success' });
                                        })
                                        .catch((e) => { enqueueSnackbar(JSON.stringify(e.message), { variant: 'error' }); });
                                }}>
                                "guardar cambios"
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        }></MiniDrawer>
    )
}
export default PerfilLineaScreen