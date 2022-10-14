import { Phone, PhoneCallbackRounded } from '@mui/icons-material'
import { Box, Button, TextField, Typography, Unstable_Grid2 as Grid } from '@mui/material'
import { height } from '@mui/system'
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api'
import axios from 'axios'
import { MuiColorInput } from 'mui-color-input'
import { useSnackbar } from 'notistack'
import React, { useEffect } from 'react'
import { urlApi, urlLinea } from '../api/myApiData'
import { MyStyleDarkMap } from '../assets/maps/myStyleMap'
import { MySvgControlGps, MySvgLinea, MySvgMinibus } from '../assets/mySvg'
import MiniDrawer from '../components/mydrawer'
import { LineaModelJson } from '../models/models'
import { LineaContext } from '../providers/LineaProvider'

const PerfilLineaScreen = () => {
    const [lineaEdit, setLineaEdit] = React.useState(LineaModelJson);
    const { enqueueSnackbar } = useSnackbar();

    const { linea,setLinea } = React.useContext(LineaContext)

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyBJ7gTWLlIZE3GqIuwwRV1FJnvx2AceHLM"
    })
    useEffect(() => {
        setLineaEdit(linea);
    }, [])

    return (
        <MiniDrawer Contend={
            <Box sx={{}}>


                <Box >
                    <Grid container
                        paddingBottom={1}
                        paddingTop={1}
                        direction="row"
                        justifyContent="space-evenly"
                        alignItems="center"
                        columnSpacing={2}
                        rowSpacing={2}>



                        <Grid container xs={12} sm={6} >
                            <Grid xs={12}>
                                <Typography variant="h3">
                                    <b>{lineaEdit.name}</b>

                                </Typography>
                                <div style={{ fontSize: '15px' }} >
                                    Edita el id, nombre, telefono, descripticion, colores y direccion de la nueva linea
                                </div>
                            </Grid>

                            <Grid xs={4} >
                                <TextField
                                    disabled
                                    fullWidth
                                    label="Id"
                                    value={lineaEdit.id}
                                    onChange={(event) => {
                                        setLineaEdit({ ...lineaEdit, id: event.target.value });
                                    }}
                                    name="numberformat"
                                    id="formatted-numberformat-input"

                                    variant="standard"
                                />
                            </Grid>
                            <Grid xs={8} >
                                <TextField
                                    fullWidth
                                    label="Nombre"
                                    value={lineaEdit.name}
                                    onChange={(event) => {
                                        setLineaEdit({ ...lineaEdit, name: event.target.value });
                                    }}
                                    name="numberformat"
                                    id="formatted-numberformat-input"

                                    variant="standard"
                                />
                            </Grid>
                            <Grid xs={12} >
                                <TextField
                                    fullWidth
                                    label="Telefono"
                                    value={lineaEdit.phone}
                                    onChange={(event) => {
                                        setLineaEdit({ ...lineaEdit, phone: event.target.value });
                                    }}
                                    name="numberformat"
                                    id="formatted-numberformat-input"

                                    variant="standard"
                                />
                            </Grid>
                            <Grid xs={12}>
                                <TextField
                                    
                                    fullWidth
                                    multiline
                                    label="Descripción"
                                    value={lineaEdit.description}
                                    onChange={(event) => {
                                        setLineaEdit({ ...lineaEdit, description: event.target.value });
                                    }}
                                    name="numberformat"
                                    id="formatted-numberformat-input"
                                    variant="standard"
                                />
                            </Grid>
                            <Grid container
                                justifyContent="space-evenly"
                                alignItems="center"
                                xs={6} sm={6}
                                maxWidth={200} >
                                <Grid xs={12} >
                                    <MySvgMinibus colorbg={lineaEdit.colorBg} colorpr={lineaEdit.colorPr} />
                                </Grid>
                            </Grid>

                            <Grid container xs={6} >
                                <Grid xs={12} >
                                    <MuiColorInput
                                        label="Color Superior"
                                        variant="standard"
                                        format="hex"
                                        fullWidth
                                        value={'#' + lineaEdit.colorBg}
                                        onChange={(color, colors) => {
                                            setLineaEdit({ ...lineaEdit, colorBg: colors.hex.slice(1) });
                                        }} /></Grid>
                                <Grid xs={12} >
                                    <MuiColorInput
                                        label="Color Inferior"
                                        variant="standard"
                                        format="hex"
                                        fullWidth
                                        value={'#' + lineaEdit.colorPr}
                                        onChange={(color, colors) => {
                                            setLineaEdit({ ...lineaEdit, colorPr: colors.hex.slice(1) });
                                        }} /></Grid>

                            </Grid>
                        </Grid>

                        <Grid xs={12} sm={6} >
                            direccion:
                            {isLoaded ? <GoogleMap

                                mapContainerStyle={{

                                    width: '100%',
                                    height: '350px'
                                }}
                                zoom={15}
                                options={{ mapTypeControl: false, streetViewControl: false, styles: MyStyleDarkMap }}
                                center={{ lat: Number.parseFloat(lineaEdit.directionLat), lng: Number.parseFloat(lineaEdit.directionLon) }}
                                //onLoad={onLoad}
                                //onUnmount={onUnmount}
                                onClick={(e) => {
                                    setLineaEdit({ ...lineaEdit, directionLat: e.latLng.lat(), directionLon: e.latLng.lng() });
                                    console.log(JSON.stringify(lineaEdit))
                                }}
                            >

                                <MarkerF position={{ lat: Number.parseFloat(lineaEdit.directionLat), lng: Number.parseFloat(lineaEdit.directionLon) }}> </MarkerF>

                                <></>
                            </GoogleMap> : <>cargando...</>}
                            <Button sx={{ m: '10px' }} variant="contained" onClick={() => {

                                //handleCloseDialog();
                                if (!lineaEdit.id
                                    || !lineaEdit.name
                                    || !lineaEdit.phone
                                    || !lineaEdit.description
                                    || !lineaEdit.colorBg
                                    || !lineaEdit.colorPr
                                    || !lineaEdit.directionLat
                                    || !lineaEdit.directionLon) {

                                    return enqueueSnackbar("Introduzca todos los datos", { variant: 'error' });
                                }

                                axios.put(urlApi + urlLinea+'/' + lineaEdit.id, lineaEdit)
                                    .then((response) => {
                                        //console.log(JSON.stringify(response));
                                        setLinea(response.data)
                                        enqueueSnackbar(lineaEdit.name + " editado con exito", { variant: 'success' });
                                        /* setLinea({
                                           id: '',
                                           name: '',
                                           description: '',
                                           directionLat: -17.783957,
                                           directionLon: -63.181132,
                                           colorBg: 'ffffff',
                                           colorPr: '3c3c3c',
                                           phone: ''
                                         })*/
                                        //setReload(1);
                                    })
                                    .catch((e) => {
                                        enqueueSnackbar(JSON.stringify(e.message), { variant: 'error' });

                                    });

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