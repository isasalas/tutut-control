
import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useDemoData } from '@mui/x-data-grid-generator';
import { DataGrid } from '@mui/x-data-grid';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import MiniDrawer from '../components/mydrawer';
import { SesionContext } from '../providers/SesionProvider';
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import { Unstable_Grid2 as Grid } from '@mui/material';
import { LineaModelJson } from '../models/models';
import { MyStyleDarkMap } from '../assets/maps/myStyleMap';

/*
function CustomFooterStatusComponent(props) {
  return (
    <Box sx={{ p: 1, display: 'flex' }}>
      <FiberManualRecordIcon
        fontSize="small"
        sx={{
          mr: 1,
          color: props.status === 'connected' ? '#4caf50' : '#d9182e',
        }}
      />
      Status {props.status}
    </Box>
  );
}

CustomFooterStatusComponent.propTypes = {
  status: PropTypes.oneOf(['connected', 'disconnected']).isRequired,
};

export { CustomFooterStatusComponent };
*/


const VueltaScreen = () => {
  const [Linea, setLinea] = React.useState(LineaModelJson);

  const [status, setStatus] = React.useState('connected');
  const { data } = useDemoData({
    dataSet: 'Employee',
    rowLength: 4,
    maxColumns: 6,
  });

  const { setSesion } = React.useContext(SesionContext)

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyBJ7gTWLlIZE3GqIuwwRV1FJnvx2AceHLM"
  })

  return (
    <MiniDrawer Contend={

      <Box sx={{ width: '100%' }}>
        <Box sx={{ height: 350, width: '100%', mb: 1 }}>

          <Grid xs={12} sm={6} >
            direccion:
            {isLoaded ? <GoogleMap

              mapContainerStyle={{

                width: '100%',
                height: '300px'
              }}
              zoom={15}
              options={{ mapTypeControl: false, streetViewControl: false, styles: MyStyleDarkMap }}
              center={{ lat: Number.parseFloat(Linea.directionLat), lng: Number.parseFloat(Linea.directionLon) }}
              //onLoad={onLoad}
              //onUnmount={onUnmount}
              onClick={(e) => {
                setLinea({ ...Linea, directionLat: e.latLng.lat(), directionLon: e.latLng.lng() });
                console.log(JSON.stringify(Linea))
              }}
            >

              <MarkerF position={{ lat: Number.parseFloat(Linea.directionLat), lng: Number.parseFloat(Linea.directionLon) }}> </MarkerF>

              { /* Child components, such as markers, info windows, etc. */}
              <></>
            </GoogleMap> : <>cargando...</>}

          </Grid>
        </Box>

      </Box>
    }></MiniDrawer>
  );
}

export default VueltaScreen


