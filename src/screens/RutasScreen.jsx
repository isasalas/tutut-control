import * as React from 'react';
import axios from 'axios';
import {
  Box, Button, Divider, TextField, Typography, Unstable_Grid2 as Grid2, InputAdornment, Switch
} from '@mui/material';
import {
  Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineDot, TimelineOppositeContent, TimelineContent, timelineOppositeContentClasses
} from '@mui/lab';
import MiniDrawer from '../components/mydrawer';
import { GoogleMap } from '@react-google-maps/api';
import { urlApi, urlLinea } from '../api/myApiData';
import { SesionContext } from '../providers/SesionProvider';
import { LineaModelJson } from '../models/models';
import { useSnackbar } from 'notistack';

let dirSerIda, dirRenIda, dirSerVuelta, dirRenVuelta;
let alphabet = 'ABCDEFGHIJKLMNOPQRSTUXYZ';
let defaultLocation = { lat: -17.783598, lng: -63.180524 };

const RutasScreen = () => {
  const { sesion } = React.useContext(SesionContext)
  const [Linea, setLinea] = React.useState(LineaModelJson)
  const [SwitchOn, setSwitchOn] = React.useState({
    on: true,
    label: "Ruta de Ida",
    displayIda: 'flex',
    displayVuelta: 'none'
  })

  const { enqueueSnackbar } = useSnackbar();
  React.useEffect(() => {
    axios.get(urlApi + urlLinea + "/" + sesion.lineaId)
      .then((re) => { setLinea(re.data); })
  }, [])
  React.useEffect(() => {
  }, [Linea, SwitchOn])
  function initMap({ map, dirSer, dirRen, ruta, type }) {
    dirSer = new window.google.maps.DirectionsService();
    dirRen = new window.google.maps.DirectionsRenderer({ draggable: true, map: map, });
    dirRen.addListener("directions_changed", function (e) {
      var directions = dirRen.getDirections();

      //directions.routes[0].overview_path.map((dir)=>{console.log(dir.toJSON())})

      if (directions) {
        try { directions.request.destination = directions.request.destination.location.toJSON() } catch { directions.request.destination = directions.request.destination.toJSON() }
        try { directions.request.origin = directions.request.origin.location.toJSON() } catch { directions.request.origin = directions.request.origin.toJSON() }

        directions.request.waypoints = directions.request.waypoints.map((loc) => {
          try { return { location: loc.location.toJSON(), stopover: loc.stopover } }
          catch { return { location: loc.location.location.toJSON(), stopover: loc.stopover } }
        })
        ruta.origin.location = directions.request.origin
        ruta.destination.location = directions.request.destination
        ruta.route = directions.routes[0].overview_path.map((dir) => { return dir.toJSON() })
        var i = -1;
        var time = ruta.waypoints.filter((point) => {
          if (point.waypoint.stopover === true) { return point.time }
        }).map((point) => { return point.time })
        ruta.polyline = directions.routes[0].overview_polyline;

        ruta.waypoints = directions.request.waypoints.map(
          (point) => {
            if (point.stopover === true) {
              i++
              return { waypoint: point, time: time[i] }
            }
            else { return { waypoint: point } }
          }
        )
        console.log(Linea.vuelta)
        console.log(Linea.ida)
        if (type === true) { setLinea({ ...Linea, ida: ruta }) }
        else { setLinea({ ...Linea, vuelta: ruta }) }
      }
    });

    map.addListener("click", function (e) {
      ruta.waypoints.push({
        waypoint: { location: e.latLng.toJSON(), stopover: true },
        time: 5
      });
      createDirection({ dirRen: dirRen, dirSer: dirSer, ruta: ruta })
    });
    createDirection({ dirRen: dirRen, dirSer: dirSer, ruta: ruta })
  }

  const createDirection = ({ ruta, dirSer, dirRen }) => {
    dirSer.route({
      origin: ruta.origin.location,
      destination: ruta.destination.location,
      travelMode: window.google.maps.TravelMode.DRIVING,
      waypoints: ruta.waypoints.map((point) => { return point.waypoint })
    })
      .then(function (result) { dirRen.setDirections(result) })
      .catch(function (e) { alert("error: " + e) });
  }

  const initMapIda = (map) => {
    initMap({ map: map, dirRen: dirRenIda, dirSer: dirSerIda, ruta: Linea.ida, type: true })
  }

  const initMapVuelta = (map) => {
    initMap({ map: map, dirRen: dirRenVuelta, dirSer: dirSerVuelta, ruta: Linea.vuelta, type: false })
  }

  const GuardarRutaIda = () => {
    console.log(Linea.ida.waypoints)
    axios.put(urlApi + urlLinea + "/" + sesion.lineaId, { ida: Linea.ida })
      .then((re) => {
        enqueueSnackbar("editado con exito", { variant: 'success' });
        setLinea(re.data);
      })
      .catch((e) => { enqueueSnackbar(JSON.stringify(e.message), { variant: 'error' }); })
  }

  const GuardarRutaVuelta = () => {
    axios.put(urlApi + urlLinea + "/" + sesion.lineaId, { vuelta: Linea.vuelta })
      .then((re) => {
        enqueueSnackbar("editado con exito", { variant: 'success' });
        setLinea(re.data);
      })
      .catch((e) => { enqueueSnackbar(JSON.stringify(e.message), { variant: 'error' }); })
  }


  var indiceParadaIda = 1
  var indiceParadaVuelta = 1




  const switchChange = () => {
    if (SwitchOn.on) {
      setSwitchOn({
        on: false,
        label: "Ruta de Vuelta",
        displayIda: 'none',
        displayVuelta: 'flex'
      })
    }
    else {
      setSwitchOn({
        on: true,
        label: "Ruta de Ida",
        displayIda: 'flex',
        displayVuelta: 'none'
      })
    }
  }

  return (
    <MiniDrawer Contend={

      !Linea.id ? <></> :
        <Box >
          <Grid2 container columnSpacing={2} rowSpacing={1}>
            <Grid2 container xs={12} sm={6}>
              <Switch xs={6} checked={SwitchOn.on} onChange={switchChange} name="gilad" />
              <Typography variant="h6" xs={6}>
                <b>{SwitchOn.label}</b>
              </Typography>
            </Grid2>
            <Grid2 container xs={12} display={SwitchOn.displayIda}>
              <Grid2 xs={12} sm={8}  >
                {!Linea.ida ? <></> :
                  <GoogleMap
                    center={defaultLocation}
                    options={{ mapTypeControl: false, zoom: 13 }}
                    onLoad={(map) => initMapIda(map)}
                    mapContainerStyle={{ height: '480px', width: '100%', marginBottom: 8 }}
                  >
                  </GoogleMap>} 
              </Grid2>

              <Grid2 xs={12} sm={4} >
                <Timeline
                  sx={{
                    m: 0,
                    mb: 1,
                    display: "flex",
                    flexDirection: "column",
                    height: 440,
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
                    Linea.ida.waypoints.map((point, index) => {
                      if (point.waypoint.stopover === true) {
                        return <TimelineItem key={index}>
                          <TimelineOppositeContent color="textSecondary">
                            <TextField variant='standard' size='small' sx={{ width: '45px' }}
                              value={Linea.ida.waypoints[index].time.toString()}
                              InputProps={{ endAdornment: <InputAdornment position="end">m.</InputAdornment> }}
                              onChange={e => {
                                var ida = Linea.ida;
                                ida.waypoints[index].time = parseInt(e.target.value?e.target.value:0)
                                //console.log( e.target.value)
                                setLinea({ ...Linea, ida: ida })
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
                        value={Linea.ida.destination.time.toString()}
                        InputProps={{ endAdornment: <InputAdornment position="end">m.</InputAdornment> }}
                        onChange={e => {
                          var ida = Linea.ida;
                          ida.destination.time = parseInt(e.target.value?e.target.value:0)
                          setLinea({ ...Linea, ida: ida })
                        }}
                      />
                    </TimelineOppositeContent>
                    <TimelineSeparator> <TimelineDot color="success" /> </TimelineSeparator>
                    <TimelineContent>Stop {alphabet[indiceParadaIda++]}</TimelineContent>
                  </TimelineItem>
                </Timeline>
                <Grid2 container xs={12} justifyContent="right" >
                  <Button children={"Guardar Cambios"} variant="text" onClick={GuardarRutaIda} />
                </Grid2>

              </Grid2>
            </Grid2>

            <Grid2 container xs={12} display={SwitchOn.displayVuelta}>
              <Grid2 xs={12} sm={8} >
                {!Linea.vuelta ? <></> :
                  <GoogleMap
                    center={defaultLocation}
                    options={{ mapTypeControl: false, zoom: 13 }}
                    zoom={14}
                    onLoad={(map) => initMapVuelta(map)}
                    mapContainerStyle={{ height: '480px', width: '100%', marginBottom: 8 }}
                  >
                  </GoogleMap>}
                 
              </Grid2>
              <Grid2 xs={12} sm={4} >
                <Timeline
                  sx={{
                    m: 0,
                    mb: 1,
                    display: "flex",
                    flexDirection: "column",
                    height: 440,
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
                    Linea.vuelta.waypoints.map((point, index) => {
                      if (point.waypoint.stopover === true) {
                        return <TimelineItem key={index}>
                          <TimelineOppositeContent color="textSecondary">
                            <TextField variant='standard' size='small' sx={{ width: '45px' }}
                              value={Linea.vuelta.waypoints[index].time.toString()}
                              InputProps={{ endAdornment: <InputAdornment position="end">m.</InputAdornment> }}
                              onChange={e => {
                                var vuelta = Linea.vuelta;
                                vuelta.waypoints[index].time = parseInt(e.target.value?e.target.value:0)
                                setLinea({ ...Linea, vuelta: vuelta })
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
                        value={Linea.vuelta.destination.time.toString()}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">m.</InputAdornment>,
                          //inputProps: { min: 0 }

                        }}
                        onChange={e => {
                          var vuelta = Linea.vuelta;
                          vuelta.destination.time = parseInt(e.target.value?e.target.value:0)
                          setLinea({ ...Linea, vuelta: vuelta })
                        }}
                      />
                    </TimelineOppositeContent>
                    <TimelineSeparator> <TimelineDot color="success" /> </TimelineSeparator>
                    <TimelineContent>Stop {alphabet[indiceParadaVuelta++]}</TimelineContent>
                  </TimelineItem>
                </Timeline>
                <Grid2 container xs={12} justifyContent="right" >
                  <Button children={"Guardar Cambios"} variant="text" onClick={GuardarRutaVuelta} />
                </Grid2>
              </Grid2>
            </Grid2>
          </Grid2>

        </Box>
    } />
  )
}

export default RutasScreen




/*
import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent, { timelineContentClasses } from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';

export default function OppositeContentTimeline() {
  return (
    <React.Fragment>
      <Timeline
        sx={{
          [`& .${timelineContentClasses.root}`]: {
            flex: 0.2,
          },
        }}
      >
        <TimelineItem>
          <TimelineOppositeContent color="textSecondary">
            09:30 am
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>Eat</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent color="textSecondary">
            10:00 am
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot />
          </TimelineSeparator>
          <TimelineContent>Code</TimelineContent>
        </TimelineItem>
      </Timeline>
    </React.Fragment>
  );
}
*/