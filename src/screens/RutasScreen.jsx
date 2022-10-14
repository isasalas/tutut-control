import * as React from 'react';
import axios from 'axios';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import MiniDrawer from '../components/mydrawer';

import { DirectionsRenderer, GoogleMap, LoadScript, Polygon, DirectionsService } from '@react-google-maps/api';



/*
import { compose, withProps, lifecycle }  from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  DirectionsRenderer,
} from "react-google-maps";*/
/*
//const google = window.google;
const MapWithADirectionsRenderer = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyBJ7gTWLlIZE3GqIuwwRV1FJnvx2AceHLM&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap,
  lifecycle({
    componentDidMount() {
      const DirectionsService = new window.google.maps.DirectionsService();

      DirectionsService.route({
        origin:  new window.google.maps.LatLng(41.8507300, -87.6512600),
        destination: new window.google.maps.LatLng(41.8525800, -87.6514100),
        travelMode: window.google.maps.TravelMode.DRIVING,
      }, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          this.setState({
            directions: result,
          });
        } else {
          console.error(`error fetching directions ${result}`);
        }
      });
    }
  })
)(props =>
  <GoogleMap
    defaultZoom={7}
    defaultCenter={new window.google.maps.LatLng(41.8507300, -87.6512600)}
  >
    {props.directions && <DirectionsRenderer directions={props.directions} />}
  </GoogleMap>
);
*/

/*
const MapContainer = (props) => {
  // This is where the path is stored. Ideally, changes made by editable and onDrag would be reflected here
  const [path, setPath] = React.useState([])
  //const [mapWidth, mapHeight] = React.useScreen()
  const [polyObj, setPolyObj] = React.useState()


  const handleMapClick = (e) => {
      let coords = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng()
      }
      console.log()
      // Add the coordinates of the click to the path
      setPath([...path, coords])
  }

  return (
      <>
          <LoadScript googleMapsApiKey="AIzaSyBJ7gTWLlIZE3GqIuwwRV1FJnvx2AceHLM" >
              <GoogleMap
                  zoom={14}
                  mapContainerStyle={{width: '750px', height: '500px'}}
                  // Fake coords used here
                  center={{
                      lat: 0.0000, 
                      lng: 0.0000
                  }}
                  onClick={handleMapClick}
              >
                  <Polygon
                      editable
                      draggable
                      path={path}
                      onDragEnd={(e) => console.log(path)}
                      onLoad={(obj) => setPolyObj(obj)}
                  />
              </GoogleMap>
          </LoadScript>
      </>
  )
}*/



const defaultLocation = { lat: -17.783598, lng: -63.180524 };
let destinationInit = { lat: -17.774608, lng: -63.182515 };
let originInit = { lat: -17.792102, lng: -63.178993 };
/*
const defaultLocation = { lat: 40.756795, lng: -73.954298 };
let destination = { lat: 41.756795, lng: -78.954298 };
let origin = { lat: 40.756795, lng: -73.954298 };
*/
let directionsService;
//let directionsRenderer;
const RutasScreen = () => {
  const [directions, setDirections] = React.useState({
    directions: null,
    bounds: null,
  })

  //function that is calling the directions service
  const changeDirection = (origin, destination) => {
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          //changing the state of directions to the result of direction service
          setDirections({
            directions: result,
          });
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  };

  const onMapLoad = (map) => {

    //load default origin and destination
    directionsService = new window.google.maps.DirectionsService();

    if (directions.directions == null) {
      console.log('recargo')
      changeDirection(originInit, destinationInit);
    }
    /*directionsRenderer = new window.google.maps.DirectionsRenderer({
      draggable: true,
      map,
      directions: 
    });*/

  };

  React.useEffect(() => {

    console.log(directions);
  }, [directions])



/*
  DirectionsRenderer.addListener("onDirectionsChanged", () => {
    const directions = DirectionsRenderer.prototype.prototype.getDirections();

    if (directions) {
      console.log(directions);
    }
  });*/










  //const ref = React.useRef()
  return (

    <MiniDrawer Contend={
      <Box >

        <GoogleMap

          center={defaultLocation}
          zoom={14}
          onLoad={(map) => onMapLoad(map)}
          mapContainerStyle={{ height: '400px', width: '100%' }}
        >
          {directions.directions !== null && (
            <DirectionsRenderer
           
              ref={{}}
              //callback={(e)=>{console.log(e)}}
              onDirectionsChanged={() => {
                //this.DirectionsRenderer.getDi
                //console.log(val);
                //DirectionsRenderer.prototype.componentDidUpdate((e)=>{console.log(e)});
               // console.log(this.DirectionsRenderer)
              }}
              directions={directions.directions}
              
              options={{
                draggable: true,
                preserveViewport: true,

              }}

            />)
          }
        </GoogleMap>

      </Box>
    } />


  )
}

export default RutasScreen









/*

/////////////////////////////////////////////////////////////////
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function initMap() {
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: { lat: -24.345, lng: 134.46 }, // Australia.
  });
  var directionsService = new google.maps.DirectionsService();
  var directionsRenderer = new google.maps.DirectionsRenderer({
    draggable: true,
    map: map,
    panel: document.getElementById("panel"),
  });
  directionsRenderer.addListener("directions_changed", function () {
    var directions = directionsRenderer.getDirections();
    if (directions) {
      computeTotalDistance(directions);
    }
  });
  displayRoute("Perth, WA", "Sydney, NSW", directionsService, directionsRenderer);
}
function displayRoute(origin, destination, service, display) {
  service
    .route({
      origin: origin,
      destination: destination,
      waypoints: [
        { location: "Adelaide, SA" },
        { location: "Broken Hill, NSW" },
      ],
      travelMode: google.maps.TravelMode.DRIVING,
      avoidTolls: true,
    })
    .then(function (result) {
      display.setDirections(result);
    })
    .catch(function (e) {
      alert("Could not display directions due to: " + e);
    });
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
window.initMap = initMap;
*/














/*
const { Component } = require('react');
const { GoogleMap, LoadScript, DirectionsService } = require("../../");
const ScriptLoaded = require("../../docs/ScriptLoaded").default;

class Directions extends Component {
  constructor (props) {
    super(props)

    this.state = {
      response: null,
      travelMode: 'DRIVING',
      origin: '',
      destination: ''
    }

    this.directionsCallback = this.directionsCallback.bind(this)
    this.checkDriving = this.checkDriving.bind(this)
    this.checkBicycling = this.checkBicycling.bind(this)
    this.checkTransit = this.checkTransit.bind(this)
    this.checkWalking = this.checkWalking.bind(this)
    this.getOrigin = this.getOrigin.bind(this)
    this.getDestination = this.getDestination.bind(this)
    this.onClick = this.onClick.bind(this)
    this.onMapClick = this.onMapClick.bind(this)
  }

  directionsCallback (response) {
    console.log(response)

    if (response !== null) {
      if (response.status === 'OK') {
        this.setState(
          () => ({
            response
          })
        )
      } else {
        console.log('response: ', response)
      }
    }
  }

  checkDriving ({ target: { checked } }) {
    checked &&
      this.setState(
        () => ({
          travelMode: 'DRIVING'
        })
      )
  }

  checkBicycling ({ target: { checked } }) {
    checked &&
      this.setState(
        () => ({
          travelMode: 'BICYCLING'
        })
      )
  }

  checkTransit ({ target: { checked } }) {
    checked &&
      this.setState(
        () => ({
          travelMode: 'TRANSIT'
        })
      )
  }

  checkWalking ({ target: { checked } }) {
    checked &&
      this.setState(
        () => ({
          travelMode: 'WALKING'
        })
      )
  }

  getOrigin (ref) {
    this.origin = ref
  }

  getDestination (ref) {
    this.destination = ref
  }

  onClick () {
    if (this.origin.value !== '' && this.destination.value !== '') {
      this.setState(
        () => ({
          origin: this.origin.value,
          destination: this.destination.value
        })
      )
    }
  }

  onMapClick (...args) {
    console.log('onClick args: ', args)
  }

  render () {
    return (
      <div className='map'>
        <div className='map-settings'>
          <hr className='mt-0 mb-3' />

          <div className='row'>
            <div className='col-md-6 col-lg-4'>
              <div className='form-group'>
                <label htmlFor='ORIGIN'>Origin</label>
                <br />
                <input id='ORIGIN' className='form-control' type='text' ref={this.getOrigin} />
              </div>
            </div>

            <div className='col-md-6 col-lg-4'>
              <div className='form-group'>
                <label htmlFor='DESTINATION'>Destination</label>
                <br />
                <input id='DESTINATION' className='form-control' type='text' ref={this.getDestination} />
              </div>
            </div>
          </div>

          <div className='d-flex flex-wrap'>
            <div className='form-group custom-control custom-radio mr-4'>
              <input
                id='DRIVING'
                className='custom-control-input'
                name='travelMode'
                type='radio'
                checked={this.state.travelMode === 'DRIVING'}
                onChange={this.checkDriving}
              />
              <label className='custom-control-label' htmlFor='DRIVING'>Driving</label>
            </div>

            <div className='form-group custom-control custom-radio mr-4'>
              <input
                id='BICYCLING'
                className='custom-control-input'
                name='travelMode'
                type='radio'
                checked={this.state.travelMode === 'BICYCLING'}
                onChange={this.checkBicycling}
              />
              <label className='custom-control-label' htmlFor='BICYCLING'>Bicycling</label>
            </div>

            <div className='form-group custom-control custom-radio mr-4'>
              <input
                id='TRANSIT'
                className='custom-control-input'
                name='travelMode'
                type='radio'
                checked={this.state.travelMode === 'TRANSIT'}
                onChange={this.checkTransit}
              />
              <label className='custom-control-label' htmlFor='TRANSIT'>Transit</label>
            </div>

            <div className='form-group custom-control custom-radio mr-4'>
              <input
                id='WALKING'
                className='custom-control-input'
                name='travelMode'
                type='radio'
                checked={this.state.travelMode === 'WALKING'}
                onChange={this.checkWalking}
              />
              <label className='custom-control-label' htmlFor='WALKING'>Walking</label>
            </div>
          </div>

          <button className='btn btn-primary' type='button' onClick={this.onClick}>
            Build Route
          </button>
        </div>

        <div className='map-container'>
          <GoogleMap
            // required
            id='direction-example'
            // required
            mapContainerStyle={{
              height: '400px',
              width: '100%'
            }}
            // required
            zoom={2}
            // required
            center={{
              lat: 0,
              lng: -180
            }}
            // optional
            onClick={this.onMapClick}
            // optional
            onLoad={map => {
              console.log('DirectionsRenderer onLoad map: ', map)
            }}
            // optional
            onUnmount={map => {
              console.log('DirectionsRenderer onUnmount map: ', map)
            }}
          >
            {
              (
                this.state.destination !== '' &&
                this.state.origin !== ''
              ) && (
                <DirectionsService
                  // required
                  options={{ // eslint-disable-line react-perf/jsx-no-new-object-as-prop
                    destination: this.state.destination,
                    origin: this.state.origin,
                    travelMode: this.state.travelMode
                  }}
                  // required
                  callback={this.directionsCallback}
                  // optional
                  onLoad={directionsService => {
                    console.log('DirectionsService onLoad directionsService: ', directionsService)
                  }}
                  // optional
                  onUnmount={directionsService => {
                    console.log('DirectionsService onUnmount directionsService: ', directionsService)
                  }}
                />
              )
            }

            {
              this.state.response !== null && (
                <DirectionsRenderer
                  // required
                  options={{ // eslint-disable-line react-perf/jsx-no-new-object-as-prop
                    directions: this.state.response
                  }}
                  // optional
                  onLoad={directionsRenderer => {
                    console.log('DirectionsRenderer onLoad directionsRenderer: ', directionsRenderer)
                  }}
                  // optional
                  onUnmount={directionsRenderer => {
                    console.log('DirectionsRenderer onUnmount directionsRenderer: ', directionsRenderer)
                  }}
                />
              )
            }
          </GoogleMap>
        </div>
      </div>
    )
  }
}

<ScriptLoaded>
  <Directions />
</ScriptLoaded>
*/