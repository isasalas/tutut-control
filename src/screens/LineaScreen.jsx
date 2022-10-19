import * as React from 'react';
import axios from 'axios';
import {
  Divider, Box, IconButton, ListItemIcon, Typography, ListItemText, TextField, MenuItem, Menu, Unstable_Grid2 as Grid
} from '@mui/material';
import {
  Delete as DeleteIcon,
  EditRounded as EditRoundedIcon,
  MoreVertRounded as MoreVertRoundedIcon
} from '@mui/icons-material'
import { MySvgMinibus, MySvgLinea } from '../assets/mySvg';
import { urlApi, urlLinea } from '../api/myApiData';
import { GoogleMap, MarkerF } from '@react-google-maps/api';
import { MyStyleDarkMap } from '../assets/maps/myStyleMap'
import { MuiColorInput } from 'mui-color-input'
import { useSnackbar } from 'notistack';
import { MySearchName } from '../components/MySearch';
import { MyBanner } from '../components/myBanner';
import MiniDrawer from '../components/mydrawer';
import { MyDialogCreate, MyDialogDelete, MyDialogEdit } from '../components/MyDialogs';

const lineaModel={
  name: null,
  description: null,
  direction: { lat: -17.783957, lng: -63.181132 },
  color: { top: 'ffffff', bottom: '3c3c3c' },
  phone: null,
  ida: {
      origin: {
          location: { lat: -17.792102, lng: -63.178993 },
          time: 0
      },
      destination: {
          location: { lat: -17.774608, lng: -63.182515 },
          time: 0
      },
      waypoint: []
  },
  vuelta: {
    origin: {
        location: { lat: -17.774608, lng: -63.182515 },
        time: 0
    },
    destination: {
        location: { lat: -17.792102, lng: -63.178993 },
        time: 0
    },
    waypoint: [ ]
},

}

const LineaScreen = () => {

  const [Lineas, setLineas] = React.useState(Array);
  const [anchorElMenu, setAnchorElMenu] = React.useState(null);
  const [Linea, setLinea] = React.useState(lineaModel);

  const { enqueueSnackbar } = useSnackbar();

  const [openDialogCreate, setOpenDialogCreate] = React.useState(false);
  const [openDialogEdit, setOpenDialogEdit] = React.useState(false);
  const [openDialogDelete, setOpenDialogDelete] = React.useState(false);
  const [searchData, setSearchData] = React.useState({ name: '' });


  const [scrollDialog, setScrollDialog] = React.useState('paper');


  const handleClickOpenDialogCreate = (scrollType) => () => {
    setOpenDialogCreate(true);
    setScrollDialog(scrollType);
  };

  const handleCloseDialog = () => {
    setLinea(lineaModel);
    setOpenDialogCreate(false);
    setOpenDialogEdit(false);
    setOpenDialogDelete(false);
  };


  const descriptionElementRef = React.useRef(null);



  React.useEffect(() => {
    axios.get(urlApi + urlLinea).then((response) => {
      setLineas(response.data);
    });
    if (openDialogCreate || openDialogEdit || openDialogDelete) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) { descriptionElement.focus(); }
    }
  }, [openDialogCreate, openDialogDelete, openDialogEdit]);

  if (!Lineas) return null;

  const openMenu = Boolean(anchorElMenu);

  const handleClickMenu = ({ linea, event }) => {
    setAnchorElMenu(event.currentTarget);
    setLinea(linea);
  };

  const handleCloseMenu = () => {
    setAnchorElMenu(null);
  };

  const deleteLinea = (e) => {
    if (Linea.id === "") { return enqueueSnackbar("Seleccione una linea", { variant: 'error' }); }

    axios.delete(urlApi + urlLinea + '/' + Linea.id)
      .then((response) => { enqueueSnackbar(Linea.name + " eliminado con exito", { variant: 'success' }); })
      .catch((e) => { enqueueSnackbar(JSON.stringify(e.message), { variant: 'error' }); });
    handleCloseDialog();
  }

  const editLinea = (e) => {

    if (!Linea.id || !Linea.name || !Linea.phone || !Linea.color.bottom || !Linea.color.top || !Linea.direction.lat || !Linea.direction.lng) {
      return enqueueSnackbar("Introduzca todos los datos", { variant: 'error' });
    }

    axios.put(urlApi + urlLinea + '/' + Linea.id, Linea)
      .then((response) => { enqueueSnackbar(Linea.name + " editado con exito", { variant: 'success' }); })
      .catch((e) => { enqueueSnackbar(JSON.stringify(e.message), { variant: 'error' }); });
    handleCloseDialog();
  }

  const createLinea = (e) => {
    if (!Linea.name
      || !Linea.phone
      || !Linea.color.bottom
      || !Linea.color.top
      || !Linea.direction.lat
      || !Linea.direction.lng) {
      return enqueueSnackbar("Introduzca todos los datos", { variant: 'error' });
    }

    axios.post(urlApi + urlLinea, Linea)
      .then((response) => {
        enqueueSnackbar(Linea.name + " creado con exito", { variant: 'success' }); 
        handleCloseDialog();
      }).catch((e) => { enqueueSnackbar(JSON.stringify(e.response.data.message), { variant: 'error' }); });
  }

  return (
    <MiniDrawer Contend={
      <Box>
        <MyBanner
          OpenDialogCreate={handleClickOpenDialogCreate}
          MySvg={<MySvgLinea />}
          MyTitle={"Lineas"}
          MyDescription={"Administre las lineas de transporte publicoAdministre las lineas de transporte publico"}
          MyBuutonText={"Crear Nueva Linea"}
        />
        <Divider />
        <MySearchName searchData={searchData} setSearchData={setSearchData} />
        <Divider />


        <Grid container columnSpacing={3}>
          {Lineas.filter((val) => {
            if (searchData.name === "") return val
            if (val.name.toLowerCase().includes(searchData.name.toLowerCase())) return val

          }).map((linea) => (
            <Grid container
              key={linea.id}
              justifyContent="space-between"
              alignItems="center"
              columnSpacing={2}
              xs={12} sm={6} md={4} lg={3} xl={2}>

              <Grid xs={3} style={{ maxHeight: '50px', paddingLeft: '15px' }}>
                <MySvgMinibus
                  style={{ maxHeight: '50px' }}
                  top={linea.color.top}
                  bottom={linea.color.bottom} />
              </Grid>

              <Grid xs={8}>
                <ListItemText
                  primary={<Typography variant="h6">{linea.name}</Typography>}
                  secondary={linea.id} />
              </Grid>

              <Grid xs={1} display="flex" justifyContent="center" alignItems="center">
                <IconButton aria-label="comment" onClick={(e) => {
                  //console.log(linea.id);
                  handleClickMenu({ event: e, linea: linea });
                }}>
                  <MoreVertRoundedIcon />
                </IconButton>

              </Grid>
              <Grid xs={12}>
                <Divider variant="mind" />
              </Grid>
            </Grid>
          ))}
        </Grid>


        <MyDialogCreate Title='Crear Nuevo Interno' Description='Introduce el id, nombre, telefono, descripticion, colores y direccion de la nueva linea' openDialogCreate={openDialogCreate} handleCloseDialog={handleCloseDialog} scrollDialog={scrollDialog} FuncCreate={createLinea}
          Conten={
            <Box >
              <Grid container paddingY={1} justifyContent="space-evenly" alignItems="center" spacing={2}>
                <Grid container xs={12} sm={6} >
                  <Grid xs={6} >
                    <TextField fullWidth label="Nombre" variant="standard" value={Linea.name} onChange={e => setLinea({ ...Linea, name: e.target.value })} />
                  </Grid>
                  <Grid xs={6} >
                    <TextField fullWidth label="Telefono" variant="standard" value={Linea.phone} onChange={e => setLinea({ ...Linea, phone: e.target.value })} />
                  </Grid>
                  <Grid container justifyContent="space-evenly" alignItems="center" xs={6} sm={6} maxWidth={200} >
                    <Grid xs={12} >
                      <MySvgMinibus bottom={Linea.color.bottom} top={Linea.color.top} />
                    </Grid>
                  </Grid>

                  <Grid container xs={6} >
                    <Grid xs={12} >
                      <MuiColorInput fullWidth label="Color Superior" variant="standard" format="hex" value={'#' + Linea.color.bottom}
                        onChange={(color, colors) => {
                          setLinea({ ...Linea, color: { top: Linea.color.top, bottom: colors.hex.slice(1) } });
                        }} /></Grid>
                    <Grid xs={12} >
                      <MuiColorInput fullWidth label="Color Inferior" variant="standard" format="hex" value={'#' + Linea.color.top}
                        onChange={(color, colors) => {
                          setLinea({ ...Linea, color: { top: colors.hex.slice(1), bottom: Linea.color.bottom } });
                        }} /></Grid>
                  </Grid>
                </Grid>

                <Grid xs={12} sm={6} >
                  direccion:
                  <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '300px' }}
                    zoom={15}
                    options={{ mapTypeControl: false, streetViewControl: false, styles: MyStyleDarkMap }}
                    center={{ lat: Number.parseFloat(Linea.direction.lat), lng: Number.parseFloat(Linea.direction.lng) }}
                    onClick={(e) => {
                      setLinea({ ...Linea, direction: { lat: e.latLng.lat(), lng: e.latLng.lng() } });
                      console.log(JSON.stringify(Linea))
                    }}
                  >
                    <MarkerF position={{ lat: Number.parseFloat(Linea.direction.lat), lng: Number.parseFloat(Linea.direction.lng) }}> </MarkerF>
                  </GoogleMap>
                </Grid>
              </Grid>
            </Box>
          } />

        <MyDialogEdit Title='title' Description='Edita el id, nombre, telefono, descripticion, colores y direccion de la nueva linea' openDialogEdit={openDialogEdit} handleCloseDialog={handleCloseDialog} scrollDialog={scrollDialog} FuncEdit={editLinea}
          Conten={
            <Box >
              <Grid container paddingY={1} justifyContent="space-evenly" alignItems="center" spacing={2}>
                <Grid container xs={12} sm={6} >
                  <Grid xs={4} >
                    <TextField fullWidth disabled label="Id" variant="standard" value={Linea.id} onChange={e => setLinea({ ...Linea, id: e.target.value })} />
                  </Grid>
                  <Grid xs={8} >
                    <TextField fullWidth label="Nombre" variant="standard" value={Linea.name} onChange={e => setLinea({ ...Linea, name: e.target.value })} />
                  </Grid>
                  <Grid xs={12}>
                    <TextField fullWidth label="Telefono" variant="standard" value={Linea.phone} onChange={e => setLinea({ ...Linea, phone: e.target.value })} />
                  </Grid>
                  <Grid container justifyContent="space-evenly" alignItems="center" xs={6} sm={6} maxWidth={200} >
                    <Grid xs={12} >
                      <MySvgMinibus bottom={Linea.color.bottom} top={Linea.color.top} />
                    </Grid>
                  </Grid>
                  <Grid container xs={6} >
                    <Grid xs={12} >
                      <MuiColorInput fullWidth label="Color Superior" variant="standard" format="hex" value={'#' + Linea.color.bottom}
                        onChange={(color, colors) => {
                          setLinea({ ...Linea, color: { top: Linea.color.top, bottom: colors.hex.slice(1) } });
                        }} /></Grid>
                    <Grid xs={12} >
                      <MuiColorInput fullWidth label="Color Inferior" variant="standard" format="hex" value={'#' + Linea.color.top}
                        onChange={(color, colors) => {
                          setLinea({ ...Linea, color: { top: colors.hex.slice(1), bottom: Linea.color.bottom } });
                        }} /></Grid>
                  </Grid>
                </Grid>

                <Grid xs={12} sm={6} >
                  direccion:
                  <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '300px' }}
                    zoom={15}
                    options={{ mapTypeControl: false, streetViewControl: false, styles: MyStyleDarkMap }}
                    center={{ lat: Number.parseFloat(Linea.direction.lat), lng: Number.parseFloat(Linea.direction.lng) }}
                    onClick={(e) => {
                      setLinea({ ...Linea, direction: { lat: e.latLng.lat(), lng: e.latLng.lng() } });
                      console.log(JSON.stringify(Linea))
                    }}
                  >
                    <MarkerF position={{ lat: Number.parseFloat(Linea.direction.lat), lng: Number.parseFloat(Linea.direction.lng) }}> </MarkerF>
                  </GoogleMap>
                </Grid>
              </Grid>
            </Box>
          } />

        <MyDialogDelete Title='Eliminar Linea' Description='Esta seguro de eliminar la Linea?' openDialogDelete={openDialogDelete} handleCloseDialog={handleCloseDialog} scrollDialog={scrollDialog} FuncDelete={deleteLinea} />

        <Menu
          anchorEl={anchorElMenu}
          open={openMenu}
          onClose={handleCloseMenu}>
          <MenuItem onClick={(e) => { setOpenDialogEdit(true); setScrollDialog('paper'); setAnchorElMenu(null); }}>
            <ListItemIcon>
              <EditRoundedIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit">Editar</Typography>
          </MenuItem>
          <MenuItem onClick={(e) => { setOpenDialogDelete(true); setScrollDialog('paper'); setAnchorElMenu(null); }}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit" noWrap> Eliminar </Typography>
          </MenuItem>
        </Menu>
      </Box>
    }></MiniDrawer>
  )
}
export default LineaScreen