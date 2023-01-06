import { Unstable_Grid2 as Grid, Box, ListItemText } from '@mui/material';
import { GoogleMap, MarkerF, PolylineF } from '@react-google-maps/api'
import React from 'react'
import Socket from './Socket.io'
import axios from 'axios';
import { urlApi, urlGps } from '../api/myApiData';
import { SesionContext } from '../providers/SesionProvider';
import { MapStyleDark } from '../utils/MapStyle';
import pinRed from '../assets/images/pin-red.png';
import pinGreen from '../assets/images/pin-green.png';
import pinYellow from '../assets/images/pin-yellow.png';
import { LocationOn, MoreVertRounded, PushPin } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment';

let defaultLocation = { lat: -17.783598, lng: -63.180524 };
const MapView = ({ viaje, ida }) => {
    const { sesion } = React.useContext(SesionContext)
    const [ruta, setRuta] = React.useState();
    const [gps, setGps] = React.useState()
    const [history, setHistory] = React.useState([])

    React.useEffect(() => {
        //setHistory([])
        //history=[]
        if (ida === true) {
            setRuta(viaje.ruta.ida)

            axios.get(urlApi + urlGps + '/' + viaje.internoId)
                .then((re) => {
                    var datito = []
                    re.data.map((loc) => {
                        if (new Date(loc.location.timestamp) >= new Date(viaje.ruta.ida.origin.time) && new Date(loc.location.timestamp) < new Date(viaje.ruta.ida.destination.time)) { datito.push({ lat: loc.location.latitude, lng: loc.location.longitude }) }
                    })
                    setHistory(datito)
                }).catch((e) => { console.log(e) })
        }
        else {
            setRuta(viaje.ruta.vuelta)
            axios.get(urlApi + urlGps + '/' + viaje.internoId)
                .then((re) => {
                    var datito = []
                    re.data.map((loc) => {
                        if (new Date(loc.location.timestamp) >= new Date(viaje.ruta.vuelta.origin.time) && new Date(loc.location.timestamp) < new Date(viaje.ruta.vuelta.destination.time)) { datito.push({ lat: loc.location.latitude, lng: loc.location.longitude }) }
                    })
                    setHistory(datito)
                }).catch((e) => { console.log(e) })
        }

    }, [ida])
    /*
        React.useEffect(() => {
            console.log(history)
        }, [history])*/

    React.useEffect(() => {



        Socket.on("gps", gpsNew => {
            if (gpsNew.internoId === viaje.internoId && ruta != null && new Date() >= new Date(ruta.origin.time) && new Date() < new Date(ruta.destination.time)) {
                //console.log({lat:gpsNew.location.latitude, lng:gpsNew.location.longitude})
                setGps(gpsNew)

                //setHistory([{ lat: gpsNew.location.latitude, lng: gpsNew.location.longitude },...history])

                /* var his=history
                 his.push({ lat: gpsNew.location.latitude, lng: gpsNew.location.longitude })
                 setHistory(his)*/
                // setHistory([...history, { lat: gpsNew.location.latitude, lng: gpsNew.location.longitude }])
                /*if(ruta)
               { axios.get(urlApi + urlGps + '/' + viaje.internoId)
                    .then((re) => {
                        var datito = []
                        re.data.map((loc) => {
                            if (new Date(loc.location.timestamp) > new Date(ruta.origin.time) && new Date(loc.location.timestamp) < new Date(ruta.destination.time)) { datito.push({ lat: loc.location.latitude, lng: loc.location.longitude }) }
                        })
                        setHistory(datito)
                    }).catch((e) => { console.log(e) })}*/
                //console.log(gpsNew)
            }

        })
        return () => { Socket.off() }
    }, [ruta, gps])


    const columns = [
        { field: 'id', headerName: 'ID', width: 50 },

        {
            field: 'hora',
            headerName: 'Hora',
            description: 'Interno asignado para el viaje.',
            width: 150,
            valueGetter: (dat) => moment(dat.row.time).format("hh:mm A")
        },
        {
            field: 'marked',
            headerName: 'Marcador',
            description: 'Conductor asignado para el viaje.',
            width: 150,
            valueGetter: (dat) => {
                if (dat.row.marked) { return moment(dat.row.marked).format("hh:mm A") }
                else { return '--' }
            }
            //type: 'boolean',
        },
        {
            field: 'm',
            headerName: 'Minutos',
            description: 'Hora a la que iniciará el viaje.',
            width: 150,
            valueGetter: (dat) => {
                if (dat.row.marked) return Math.round((new Date(dat.row.time).getTime() - new Date(dat.row.marked).getTime()) / 1000 / 60)
                else return '--'
            }

        }

    ];

    const markeds = (rut) => {
        var a = 0;
        var array = []
        array.push({ ...rut.origin, id: a++ })
        rut.waypoints.map(dat => {
            if (dat.waypoint.stopover === true) {
                array.push({ ...dat, id: a++ })
            }
        })
        array.push({ ...rut.destination, id: a++ })
        //console.log(array)
        return array
    }

    if (!viaje || !ruta) return <></>
    return (
        <Box >
            <Grid container paddingY={1} justifyContent="space-evenly" alignItems="center" spacing={2}>
                <Box sx={{ height: "65vh", width: '100%', marginBottom:2 }}>
                    <DataGrid
                        rows={markeds(ruta)}
                        columns={columns}
                    />
                </Box>
                <Grid container xs={12} width='1000px'>
                    <GoogleMap
                        //center={{ lat: gps.location.latitude, lng: gps.location.longitude }}
                        center={defaultLocation}
                        options={{ styles: MapStyleDark, mapTypeControl: false, streetViewControl: false }}
                        zoom={12}
                        //onLoad={(map) => initMapIda(map)}
                        mapContainerStyle={{ height: '300px', width: '100%', marginBottom: 8, }}
                    >
                        {gps != null && viaje != null && new Date() >= new Date(ruta.origin.time) && new Date() <= new Date(ruta.destination.time) ?
                            <MarkerF
                                //title={viaje.interno.name}
                                //title= {`Interno: ${viaje.interno.name}\nVel: ${Math.floor(gps.location.speed)} km/h `}
                                /* options={{
                                     title: `Interno: ${viaje.interno.name}\nVel: ${Math.floor(gps.location.speed)} km/h `
                                 }}*/
                                icon={{ url: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png', scaledSize: { width: 35, height: 35 } }}
                                position={{ lat: gps.location.latitude, lng: gps.location.longitude }}

                            /> : null}

                        {history[0] ?
                            <PolylineF path={history} options={{ strokeColor: '#f72525', strokeOpacity: 0.5, strokeWeight: 4 }}></PolylineF> : null}

                        <PolylineF path={ruta.route} options={{ strokeColor: '#0398fc', strokeOpacity: 0.5, strokeWeight: 4 }}></PolylineF>
                        <MarkerF

                            icon={{
                                url: pinRed,
                                scaledSize: { width: 30, height: 30 }
                            }}
                            position={{
                                lat: ruta.origin.location.lat,
                                lng: ruta.origin.location.lng
                            }}
                            options={{
                                title: new Date(ruta.origin.time).getHours().toString().padStart(2, '0') + ":"
                                    + new Date(ruta.origin.time).getMinutes().toString().padStart(2, '0')
                            }}
                        /*title={
                            new Date(ruta.origin.time).getHours().toString().padStart(2, '0') + ":"
                            + new Date(ruta.origin.time).getMinutes().toString().padStart(2, '0')
                        }*/
                        />
                        {ruta.waypoints.map(marker => (
                            (marker.waypoint.stopover === true) ?
                                <MarkerF
                                    //opacity={0.9}
                                    icon={{
                                        url: pinYellow,
                                        scaledSize: { width: 30, height: 30 }
                                    }}
                                    key={marker.waypoint.location.lat}
                                    position={{
                                        lat: marker.waypoint.location.lat,
                                        lng: marker.waypoint.location.lng
                                    }}
                                    title={
                                        new Date(marker.time).getHours().toString().padStart(2, '0') + ":"
                                        + new Date(marker.time).getMinutes().toString().padStart(2, '0')
                                    }
                                /> : null
                        )
                        )}
                        <MarkerF
                            // opacity={0.7}
                            icon={{
                                url: pinGreen,
                                scaledSize: { width: 30, height: 30 }
                            }}

                            position={{
                                lat: ruta.destination.location.lat,
                                lng: ruta.destination.location.lng
                            }}
                            options={
                                {
                                    title:
                                        new Date(ruta.destination.time).getHours().toString().padStart(2, '0') + ":"
                                        + new Date(ruta.destination.time).getMinutes().toString().padStart(2, '0')

                                }
                            }
                        /*title={
                            new Date(ruta.destination.time).getHours().toString().padStart(2, '0') + ":"
                            + new Date(ruta.destination.time).getMinutes().toString().padStart(2, '0')
                        }*/
                        />
                    </GoogleMap>

                </Grid>

                {/*<Grid container xs={12}>

                    <Grid xs={1}>
                        <LocationOn />
                    </Grid>
                    <Grid xs={2}>
                        <ListItemText
                            primary={
                                !ruta.origin.marked ? '--' :
                                    Math.round((new Date(ruta.origin.time).getTime() - new Date(ruta.origin.marked).getTime()) / 1000 / 60) + ' m.'
                            }
                        />
                    </Grid>
                    <Grid xs={6}>
                        <ListItemText
                            secondary={'Hora: '
                                + new Date(ruta.origin.time).getHours().toString().padStart(2, '0') + ":"
                                + new Date(ruta.origin.time).getMinutes().toString().padStart(2, '0')}
                        />
                        <ListItemText
                            secondary={'\nMarcado: '
                                + (!ruta.origin.marked ? '--' : new Date(ruta.origin.marked).getHours().toString().padStart(2, '0') + ":"
                                    + new Date(ruta.origin.marked).getMinutes().toString().padStart(2, '0'))}
                        />
                    </Grid>
                </Grid>



                {ruta.waypoints.map((dat) => (
                    (dat.waypoint.stopover === true) ?
                        <Grid xs={12}>
                            <ListItemText
                                key={dat.waypoint.location.lat}
                                primary={
                                    !dat.marked ? '--' :
                                        Math.round((new Date(dat.time).getTime() - new Date(dat.marked).getTime()) / 1000 / 60) + ' m.'}
                                secondary={'Hora: '
                                    + new Date(dat.time).getHours().toString().padStart(2, '0') + ":"
                                    + new Date(dat.time).getMinutes().toString().padStart(2, '0')
                                    + '\nMarcado: '
                                    + (!dat.marked ? '--' :
                                        +new Date(dat.marked).getHours().toString().padStart(2, '0') + ":"
                                        + new Date(dat.marked).getMinutes().toString().padStart(2, '0'))}

                            />
                        </Grid> : null
                ))}
                <Grid container xs={12}>
                    <Grid xs={12}>
                        <ListItemText
                            primary={
                                !ruta.destination.marked ? '--' :
                                    Math.round((new Date(ruta.destination.time).getTime() - new Date(ruta.destination.marked).getTime()) / 1000 / 60) + ' m.'

                            }
                            secondary={'Hora: '
                                + new Date(ruta.destination.time).getHours().toString().padStart(2, '0') + ":"
                                + new Date(ruta.destination.time).getMinutes().toString().padStart(2, '0')
                                + '\nMarcado: '
                                + (!ruta.destination.marked ? '--' :
                                    + new Date(ruta.destination.marked).getHours().toString().padStart(2, '0') + ":"
                                    + new Date(ruta.destination.marked).getMinutes().toString().padStart(2, '0'))}

                        /></Grid>
                </Grid>*/}

            </Grid>
        </Box>
    )
}

export default MapView