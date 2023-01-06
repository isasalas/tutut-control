import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineOppositeContent, TimelineSeparator } from '@mui/lab'
import { Button, InputAdornment, TextField, Unstable_Grid2 as Grid2 } from '@mui/material'
import { Box } from '@mui/system'
import { GoogleMap } from '@react-google-maps/api'
import React from 'react'

let alphabet = 'ABCDEFGHIJKLMNOPQRSTUXYZ';
let defaultLocation = { lat: -17.783598, lng: -63.180524 };

const RutasView = ({ SwitchOn, ruta, setRuta }) => {

    var indiceParadaIda = 1
    var indiceParadaVuelta = 1

    function initMap({ mapa, rutita, type }) {
        var dirSer = new window.google.maps.DirectionsService();
        var dirRen = new window.google.maps.DirectionsRenderer({ draggable: true, map: mapa, });
        dirRen.addListener("directions_changed", function (e) {
            var directions = dirRen.getDirections();

            if (directions) {
                try { directions.request.destination = directions.request.destination.location.toJSON() } catch { directions.request.destination = directions.request.destination.toJSON() }
                try { directions.request.origin = directions.request.origin.location.toJSON() } catch { directions.request.origin = directions.request.origin.toJSON() }

                directions.request.waypoints = directions.request.waypoints.map((loc) => {
                    try { return { location: loc.location.toJSON(), stopover: loc.stopover } }
                    catch { return { location: loc.location.location.toJSON(), stopover: loc.stopover } }
                })
                rutita.origin.location = directions.request.origin
                rutita.destination.location = directions.request.destination
                rutita.route = directions.routes[0].overview_path.map((dir) => { return dir.toJSON() })
                var i = -1;
                var time = rutita.waypoints.filter((point) => {
                    if (point.waypoint.stopover === true) { return point.time }
                }).map((point) => { return point.time })
                rutita.polyline = directions.routes[0].overview_polyline;

                rutita.waypoints = directions.request.waypoints.map(
                    (point) => {
                        if (point.stopover === true) {
                            i++
                            return { waypoint: point, time: time[i] }
                        }
                        else { return { waypoint: point } }
                    }
                )
                if (type === true) { setRuta({ ...ruta, ida: rutita }) }
                else { setRuta({ ...ruta, vuelta: rutita }) }
            }
        });

        mapa.addListener("click", function (e) {
            rutita.waypoints.push({
                waypoint: { location: e.latLng.toJSON(), stopover: true },
                time: 5
            });
            createDirection({ dirRen: dirRen, dirSer: dirSer, rutita: rutita })
        });
        createDirection({ dirRen: dirRen, dirSer: dirSer, rutita: rutita })
    }


    const createDirection = ({ rutita, dirSer, dirRen }) => {
        dirSer.route({
            origin: rutita.origin.location,
            destination: rutita.destination.location,
            travelMode: window.google.maps.TravelMode.DRIVING,
            waypoints: rutita.waypoints.map((point) => { return point.waypoint })
        })
            .then(function (result) { dirRen.setDirections(result) })
            .catch(function (e) { alert("error: " + e) });
    }

    const initMapIda = (mapa) => {
        const rutaida = ruta.ida
        initMap({ mapa: mapa, rutita: rutaida, type: true })
    }

    const initMapVuelta = (mapa) => {
        const rutavuelta = ruta.vuelta
        initMap({ mapa: mapa, rutita: rutavuelta, type: false })
    }

    return (
        <Box display={'flex'} >
            <Grid2 container xs={12} display={SwitchOn.displayIda}>
                <Grid2 xs={12} sm={6}  >
                    {!ruta.ida ? <></> :
                        <GoogleMap
                            center={defaultLocation}
                            options={{ mapTypeControl: false, zoom: 13 }}
                            onLoad={(mapa) => initMapIda(mapa)}
                            mapContainerStyle={{ height: '50vh', width: '100%', marginBottom: 8 }}
                        >
                        </GoogleMap>}
                </Grid2>

                <Grid2 xs={12} sm={6} >
                    <Timeline
                        sx={{
                            m: 0,
                            mb: 1,
                            display: "flex",
                            flexDirection: "column",
                            height: '50vh',
                            overflow: "hidden",
                            overflowY: "scroll",

                        }}
                    >
                        <TimelineItem>
                            <TimelineOppositeContent children={"-"} color="textSecondary" />
                            <TimelineSeparator> <TimelineDot variant="outlined" color="warning" /> <TimelineConnector />  </TimelineSeparator>
                            <TimelineContent>Salida A</TimelineContent>
                        </TimelineItem>
                        {
                            ruta.ida.waypoints.map((point, index) => {
                                if (point.waypoint.stopover === true) {
                                    return <TimelineItem key={index}>
                                        <TimelineOppositeContent color="textSecondary">
                                            <TextField variant='standard' size='small' sx={{ width: '45px' }}
                                                value={ruta.ida.waypoints[index].time.toString()}
                                                InputProps={{ endAdornment: <InputAdornment position="end">m.</InputAdornment> }}
                                                onChange={e => {
                                                    var ida = ruta.ida;
                                                    ida.waypoints[index].time = parseInt(e.target.value ? e.target.value : 0)
                                                    //console.log( e.target.value)
                                                    setRuta({ ...ruta, ida: ida })
                                                }}
                                            />
                                        </TimelineOppositeContent>
                                        <TimelineSeparator> <TimelineDot variant="outlined" color="error" /> <TimelineConnector />  </TimelineSeparator>
                                        <TimelineContent>{"Stop " + alphabet[indiceParadaIda++]}</TimelineContent>
                                    </TimelineItem>
                                }
                            })
                        }

                        <TimelineItem>
                            <TimelineOppositeContent color="textSecondary">
                                <TextField variant='standard' size='small' sx={{ width: '45px' }}
                                    value={ruta.ida.destination.time.toString()}
                                    InputProps={{ endAdornment: <InputAdornment position="end">m.</InputAdornment> }}
                                    onChange={e => {
                                        var ida = ruta.ida;
                                        ida.destination.time = parseInt(e.target.value ? e.target.value : 0)
                                        setRuta({ ...ruta, ida: ida })
                                    }}
                                />
                            </TimelineOppositeContent>
                            <TimelineSeparator> <TimelineDot color="success" /> </TimelineSeparator>
                            <TimelineContent>Stop {alphabet[indiceParadaIda++]}</TimelineContent>
                        </TimelineItem>
                    </Timeline>
                </Grid2>
            </Grid2>

            <Grid2 container xs={12} display={SwitchOn.displayVuelta}>
                <Grid2 xs={12} sm={6} >
                    {!ruta.vuelta ? <></> :
                        <GoogleMap
                            center={defaultLocation}
                            options={{ mapTypeControl: false, zoom: 13 }}
                            zoom={14}
                            onLoad={(map) => initMapVuelta(map)}
                            mapContainerStyle={{ height: '50vh', width: '100%', marginBottom: 8 }}
                        >
                        </GoogleMap>}

                </Grid2>
                <Grid2 xs={12} sm={6} >
                    <Timeline
                        sx={{
                            m: 0,
                            mb: 1,
                            display: "flex",
                            flexDirection: "column",
                            height: '50vh',
                            overflow: "hidden",
                            overflowY: "scroll",
                        }}
                    >

                        <TimelineItem>
                            <TimelineOppositeContent children={"-"} color="textSecondary" />
                            <TimelineSeparator> <TimelineDot variant="outlined" color="warning" /> <TimelineConnector />  </TimelineSeparator>
                            <TimelineContent>Salida A</TimelineContent>
                        </TimelineItem>
                        {
                            ruta.vuelta.waypoints.map((point, index) => {
                                if (point.waypoint.stopover === true) {
                                    return <TimelineItem key={index}>
                                        <TimelineOppositeContent color="textSecondary">
                                            <TextField variant='standard' size='small' sx={{ width: '45px' }}
                                                value={ruta.vuelta.waypoints[index].time.toString()}
                                                InputProps={{ endAdornment: <InputAdornment position="end">m.</InputAdornment> }}
                                                onChange={e => {
                                                    var vuelta = ruta.vuelta;
                                                    vuelta.waypoints[index].time = parseInt(e.target.value ? e.target.value : 0)
                                                    setRuta({ ...ruta, vuelta: vuelta })
                                                }}
                                            />
                                        </TimelineOppositeContent>
                                        <TimelineSeparator> <TimelineDot variant="outlined" color="error" /> <TimelineConnector />  </TimelineSeparator>
                                        <TimelineContent>{"Stop " + alphabet[indiceParadaVuelta++]}</TimelineContent>
                                    </TimelineItem>
                                }
                            })
                        }

                        <TimelineItem>
                            <TimelineOppositeContent color="textSecondary">
                                <TextField variant='standard' size='small' sx={{ width: '45px' }}
                                    value={ruta.vuelta.destination.time.toString()}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">m.</InputAdornment>,
                                    }}
                                    onChange={e => {
                                        var vuelta = ruta.vuelta;
                                        vuelta.destination.time = parseInt(e.target.value ? e.target.value : 0)
                                        setRuta({ ...ruta, vuelta: vuelta })
                                    }}
                                />
                            </TimelineOppositeContent>
                            <TimelineSeparator> <TimelineDot color="success" /> </TimelineSeparator>
                            <TimelineContent>Stop {alphabet[indiceParadaVuelta++]}</TimelineContent>
                        </TimelineItem>
                    </Timeline>
                </Grid2>
            </Grid2>
        </Box>
    )
}

export default RutasView