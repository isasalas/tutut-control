import * as React from 'react';
import axios from 'axios';
import {
  Box, Button, Divider, TextField, Typography, Unstable_Grid2 as Grid2
} from '@mui/material';
import {
  Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineDot, TimelineOppositeContent, TimelineContent, timelineOppositeContentClasses
} from '@mui/lab';
import MiniDrawer from '../components/mydrawer';

import { DirectionsRenderer, GoogleMap, MarkerF } from '@react-google-maps/api';
import { MyBanner } from '../components/myBanner';
import { MySvgControl } from '../assets/mySvg';
import { urlApi, urlLinea } from '../api/myApiData';
import { SesionContext } from '../providers/SesionProvider';
import { LineaModelJson } from '../models/models';
import { ContactlessOutlined } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

let dirSerIda, dirRenIda, dirSerVuelta, dirRenVuelta;

const defaultLocation = { lat: -17.783598, lng: -63.180524 };
/*let destinationInit = { lat: -17.774608, lng: -63.182515 };
let originInit = { lat: -17.792102, lng: -63.178993 };*/


const RutasScreen = () => {
  const { sesion } = React.useContext(SesionContext)
  const [Linea, setLinea] = React.useState(LineaModelJson)
  const { enqueueSnackbar } = useSnackbar();


  React.useEffect(() => {
    axios.get(urlApi + urlLinea + "/" + sesion.lineaId)
      .then((re) => { setLinea(re.data); })

  }, [])

  React.useEffect(() => {
    //console.log('se reacrgo')
  }, [Linea])



  function initMap({ map, dirSer, dirRen, ruta }) {
    dirSer = new window.google.maps.DirectionsService();
    dirRen = new window.google.maps.DirectionsRenderer({
      draggable: true,
      map: map,
    });
    dirRen.addListener("directions_changed", function (e) {
      var directions = dirRen.getDirections();
      if (directions) {
        try { directions.request.destination = directions.request.destination.location.toJSON() } catch { directions.request.destination = directions.request.destination.toJSON() }
        try { directions.request.origin = directions.request.origin.location.toJSON() } catch { directions.request.origin = directions.request.origin.toJSON() }

        directions.request.waypoints = directions.request.waypoints.map((loc) => {
          try { return { location: loc.location.toJSON(), stopover: loc.stopover } }
          catch { return { location: loc.location.location.toJSON(), stopover: loc.stopover } }
        })
        ruta.origin.location = directions.request.origin
        ruta.destination.location = directions.request.destination
        ruta.waypoint = directions.request.waypoints
      }
      console.log(ruta)
    });

    map.addListener("click", function (e) {
      ruta.waypoint.push({ location: e.latLng.toJSON(), stopover: true });
      createDirection({ dirRen: dirRen, dirSer: dirSer, ruta: ruta })
    });
    createDirection({ dirRen: dirRen, dirSer: dirSer, ruta: ruta })
  }

  const createDirection = ({ ruta, dirSer, dirRen }) => {
    /*delete ruta.origin.time;
    delete ruta.destination.time;*/
    dirSer.route({
      origin: ruta.origin.location,
      destination: ruta.destination.location,
      travelMode: window.google.maps.TravelMode.DRIVING,
      waypoints: ruta.waypoint.map((point) => { delete point.time; return point })
    })
      .then(function (result) {
        console.warn(ruta.waypoint)
        dirRen.setDirections(result);
      })
      .catch(function (e) {
        alert("error: " + e);
      });
  }

  const initMapIda = (map) => {
    initMap({
      map: map,
      dirRen: dirRenIda,
      dirSer: dirSerIda,
      ruta: Linea.ida,
    })
  }

  const initMapVuelta = (map) => {
    initMap({
      map: map,
      dirRen: dirRenVuelta,
      dirSer: dirSerVuelta,
      ruta: Linea.vuelta,
    })
  }

  const GuardarRutaIda = () => {
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



  return (
    <MiniDrawer Contend={

      !Linea.id ? <></> :
        <Box >
          <Grid2 container columnSpacing={2} rowSpacing={2}>
            <Grid2 container xs={12} >
              <Grid2 xs={12} sm={8} container marginBottom={"3px"}>
                <Grid2 xs={12} sm={6} >
                  <Typography variant="h5">
                    <b>Ruta de Ida</b>
                  </Typography>
                </Grid2>
                <Grid2 container xs={12} sm={6} justifyContent="end" >
                  <Button variant="text" onClick={GuardarRutaIda}>
                    Guardar Cambios
                  </Button>
                </Grid2>
                <Grid2 xs={12} >

                  {!Linea.ida ? <></> :
                    <GoogleMap
                      Key={Linea}
                      center={defaultLocation}
                      options={{ mapTypeControl: false }}
                      zoom={14}
                      onLoad={(map) => initMapIda(map)}
                      mapContainerStyle={{ height: '460px', width: '100%' }}
                    >
                    </GoogleMap>}
                </Grid2>
              </Grid2>

              <Grid2 xs={12} sm={4} >
                <Timeline
                  sx={{
                    [`& .${timelineOppositeContentClasses.root}`]: {
                      flex: 1,
                    },
                  }}
                >

                  <TimelineItem>
                    <TimelineOppositeContent color="textSecondary">
                      123

                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot />
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>Salida</TimelineContent>
                  </TimelineItem>
                  {
                    Linea.ida.waypoint.filter((val) => {
                      if (val.stopover === true) return val
                    }).map((point) => {
                      <TimelineItem>
                        <TimelineOppositeContent color="textSecondary">
                          {"+" + point.time + " m."}
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                          <TimelineDot />
                          <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>Salida</TimelineContent>
                      </TimelineItem>

                    })
                  }
                  <TimelineItem>
                    <TimelineOppositeContent color="textSecondary">
                      123
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot />
                    </TimelineSeparator>
                    <TimelineContent>Final</TimelineContent>
                  </TimelineItem>
                </Timeline>
              </Grid2>

              <Grid2 xs={12}>
                <Divider />
              </Grid2>
            </Grid2>

            <Grid2 xs={12} >
              <Grid2 xs={12} container paddingX={1} >
                <Grid2 xs={12} sm={6}>
                  <Typography variant="h5">
                    <b>Ruta de Vuelta</b>
                  </Typography>
                </Grid2>
                <Grid2 container xs={12} sm={6} justifyContent="right" >
                  <Button variant="text" onClick={GuardarRutaVuelta}>
                    Guardar Cambios
                  </Button>
                </Grid2>
              </Grid2>

              <GoogleMap
                center={defaultLocation}
                zoom={14}
                onLoad={(map) => initMapVuelta(map)}
                mapContainerStyle={{ height: '460px', width: '100%' }}
                
              >
              </GoogleMap>
              <Grid2 xs={12}>
                <Divider />
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