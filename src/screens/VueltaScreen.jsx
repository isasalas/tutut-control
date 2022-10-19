import * as React from 'react';
import axios from 'axios';
import { Box, Unstable_Grid2 as Grid2 } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import MiniDrawer from '../components/mydrawer';

import { GoogleMap } from '@react-google-maps/api';

let dirSerIda, dirRenIda, dirSerVuelta, dirRenVuelta;

const defaultLocation = { lat: -17.783598, lng: -63.180524 };
let destinationInit = { lat: -17.774608, lng: -63.182515 };
let originInit = { lat: -17.792102, lng: -63.178993 };
 
const VueltaScreen = () => {
  const [wpIda, setWpIda] = React.useState({
    directions: null,
    bounds: null,
  })

  const [wpVuelta, setWpVuelta] = React.useState({
    directions: null,
    bounds: null,
  })

  const [originIda, setOriginIda] = React.useState({
    lat: null,
    lon: null,
  })

  const [originVuelta, setOriginVuelta] = React.useState({
    lat: null,
    lon: null,
  })

  function initMap({ map, dirSer, dirRen, setDir, dir }) {
    dirSer = new window.google.maps.DirectionsService();
    dirRen = new window.google.maps.DirectionsRenderer({
      draggable: true,
      map: map,
    });

    dirRen.addListener("directions_changed", function () {

      var directions = dirRen.getDirections();
      if (directions) {
        console.log(directions.geocoded_waypoints)
        console.log(directions.routes[0].legs)


        setDir(directions);
       /* const route = []
        directions.routes[0].overview_path.map((e) => {
          route.push(e.toJSON())
        })
        directions.routes[0].legs.map((e) => {
          console.log(e.steps)
        });*/
      }
    });

    if (dir.directions == null) {
      //console.log('recargo')
      displayRoute(originInit, destinationInit, dirSer, dirRen);
    }
  }

  function computeTotalDistance(result) {
    var total = 0;
    var myroute = result.routes[0];
    if (!myroute) {
        return;
    }
    for (var i = 0; i < myroute.legs.length; i++) {
        total += myroute.legs[i].distance.value;
    }
    total = total / 1000;
    document.getElementById("total").innerHTML = total + " km";
}

  function displayRoute(origin, destination, dirSer, dirRen) {
    dirSer
      .route({
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
        waypoints: [
          {
            location: { lat: -17.783598, lng: -63.180524 },
            stopover: false,
          }
        ],
      })
      .then(function (result) {
        dirRen.setDirections(result);
      })
      .catch(function (e) {
        alert("Could not display directions due to: " + e);
      });
  }

  function initMapIda(map) {
    initMap({ map: map, dirRen: dirRenIda, dirSer: dirSerIda, setDir: setWpIda, dir: wpIda })
  }

  function initMapVuelta(map) {
    initMap({ map: map, dirRen: dirRenVuelta, dirSer: dirSerVuelta, setDir: setWpVuelta, dir: wpVuelta })
  }

  return (
    <MiniDrawer Contend={
      <Box >
        <Grid2 container columnSpacing={2} rowSpacing={2}>
          <Grid2 xs={12} sm={6}>
            <GoogleMap
              center={defaultLocation}
              zoom={14}
              onLoad={(map) => initMapIda(map)}
              mapContainerStyle={{ height: '400px', width: '100%' }}
            >
            </GoogleMap>
          </Grid2>
          <Grid2 xs={12} sm={6}>
            <GoogleMap
              center={defaultLocation}
              zoom={14}
              onLoad={(map) => initMapVuelta(map)}
              mapContainerStyle={{ height: '400px', width: '100%' }}
            >
            </GoogleMap>
          </Grid2>
        </Grid2>
      </Box>
    } />
  )
}

export default VueltaScreen