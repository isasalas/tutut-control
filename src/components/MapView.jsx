import { BusAlert } from '@mui/icons-material';
import { Unstable_Grid2 as Grid, Box } from '@mui/material';
import { GoogleMap, Marker, MarkerF, Polyline, PolylineF } from '@react-google-maps/api'
import React from 'react'
import Socket from './Socket.io'
import axios from 'axios';
import { urlApi, urlGps, urlLinea } from '../api/myApiData';
import { SesionContext } from '../providers/SesionProvider';
import { LineaModelJson } from '../models/models';
import { MapStyleDark } from '../utils/MapStyle';
import { SvgPin } from '../assets/mySvg';
import { MyIp } from '../utils/Constantes';

let defaultLocation = { lat: -17.783598, lng: -63.180524 };
let dirSerIda, dirRenIda, dirSerVuelta, dirRenVuelta;
const MapView = ({ viaje, ida }) => {
    const { sesion } = React.useContext(SesionContext)
    const [ruta, setRuta] = React.useState();
    const [gps, setGps] = React.useState()
    const [history, setHistory] = React.useState([])

    React.useEffect(() => {
        //setHistory([])
        //history=[]
        if (ida === true) {
            setRuta(viaje.ida)

            axios.get(urlApi + urlGps + '/' + viaje.internoId)
                .then((re) => {
                    var datito = []
                    re.data.map((loc) => {
                        if (new Date(loc.location.timestamp) >= new Date(viaje.ida.origin.time) && new Date(loc.location.timestamp) < new Date(viaje.ida.destination.time)) { datito.push({ lat: loc.location.latitude, lng: loc.location.longitude }) }
                    })
                    setHistory(datito)
                }).catch((e) => { console.log(e) })
        }
        else {
            setRuta(viaje.vuelta)
            axios.get(urlApi + urlGps + '/' + viaje.internoId)
                .then((re) => {
                    var datito = []
                    re.data.map((loc) => {
                        if (new Date(loc.location.timestamp) >= new Date(viaje.vuelta.origin.time) && new Date(loc.location.timestamp) < new Date(viaje.vuelta.destination.time)) { datito.push({ lat: loc.location.latitude, lng: loc.location.longitude }) }
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
    }, [ruta,gps])

    if (!viaje || !ruta) return <></>
    return (
        <Box >
            <Grid container paddingY={1} justifyContent="space-evenly" alignItems="center" spacing={2}>
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
                                url: 'https://cdn-icons-png.flaticon.com/512/2377/2377922.png',
                                scaledSize: { width: 25, height: 25 }
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
                                        url: `http://${MyIp}:5000/assets/images/pin-orange.png`,
                                        scaledSize: { width: 25, height: 25 }
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
                                url: `http://${MyIp}:5000/assets/images/pin-yellow.png`,
                                scaledSize: { width: 25, height: 25 }
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

            </Grid>
        </Box>
    )
}

export default MapView