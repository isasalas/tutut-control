import * as React from 'react';
import axios from 'axios';
import {
  Divider,
  Box,
  Button,
  IconButton,
  ListItemIcon,
  Typography,
  ListItemText,
  TextField,
  MenuItem,
  Menu,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Unstable_Grid2 as Grid
} from '@mui/material';
import {
  Delete as DeleteIcon,
  EditRounded as EditRoundedIcon,
  SearchRounded as SearchRoundedIcon,
  MoreVertRounded as MoreVertRoundedIcon
} from '@mui/icons-material'
import {
  MySvgMinibus,
  MySvgLinea
} from '../assets/mySvg';
import { urlApi, urlLinea } from '../api/myApiData';
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF
} from '@react-google-maps/api';
import {MyStyleDarkMap} from '../assets/maps/myStyleMap'
import { MuiColorInput } from 'mui-color-input'
import { useSnackbar } from 'notistack';
import { LineaModelJson, LineaModel } from '../models/models';
import { MySearchName } from '../components/MySearch';
import { MyBanner } from '../components/myBanner';
import MiniDrawer from '../components/mydrawer';



const LineaScreen = () => {

  const [Lineas, setLineas] = React.useState(Array);
  const [anchorElMenu, setAnchorElMenu] = React.useState(null);
  const [Linea, setLinea] = React.useState(LineaModelJson);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyBJ7gTWLlIZE3GqIuwwRV1FJnvx2AceHLM"
  })

  const { enqueueSnackbar } = useSnackbar();

  const [openDialogCreate, setOpenDialogCreate] = React.useState(false);
  const [openDialogEdit, setOpenDialogEdit] = React.useState(false);
  const [openDialogDelete, setOpenDialogDelete] = React.useState(false);
  const [searchData, setSearchData] = React.useState({ name: '' });


  const [scrollDialog, setScrollDialog] = React.useState('paper');
  const [reload, setReload] = React.useState();


  const handleClickOpenDialogCreate = (scrollType) => () => {
    setLinea(LineaModelJson);
    setOpenDialogCreate(true);
    setScrollDialog(scrollType);
  };
  /*
    const handleClickOpenDialogEdit = (scrollType) => () => {
      setOpenDialogEdit(true);
      setScrollDialog(scrollType);
    };*/

  const handleCloseDialog = () => {
    setOpenDialogCreate(false);
    setOpenDialogEdit(false);
    setOpenDialogDelete(false);
  };


  const descriptionElementRef = React.useRef(null);



  React.useEffect(() => {
    axios.get(urlApi + '/linea').then((response) => {
      setLineas(response.data);
    });
    if (openDialogCreate || openDialogEdit || openDialogDelete) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }

  }, [openDialogCreate, openDialogDelete, openDialogEdit, reload]);

  if (!Lineas) return null;


  const openMenu = Boolean(anchorElMenu);

  const handleClickMenu = ({ linea, event }) => {
    setAnchorElMenu(event.currentTarget);
    setLinea(linea);


  };
  const handleCloseMenu = () => {
    setAnchorElMenu(null);

    console.log(JSON.stringify(Linea))

  };





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
              //display="flex"
              justifyContent="space-between"
              alignItems="center"
              columnSpacing={2}
              xs={12} sm={6} md={4} lg={3} xl={2}>

              <Grid xs={3} style={{ maxHeight: '50px', paddingLeft: '15px' }}>
                <MySvgMinibus
                  style={{ maxHeight: '50px' }}
                  colorpr={linea.colorPr}
                  colorbg={linea.colorBg} />
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

        <div>



          <Dialog
            open={openDialogCreate}
            onClose={handleCloseDialog}
            scroll={scrollDialog}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
          >
            <DialogTitle id="scroll-dialog-title">
              Crear Nueva Linea
            </DialogTitle>
            <DialogContent dividers={scrollDialog === 'paper'}>

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
                      <div style={{ fontSize: '15px' }} >
                        Introduce el id, nombre, telefono, descripticion, colores y direccion de la nueva linea
                      </div>
                    </Grid>

                    
                    <Grid xs={6} >
                      <TextField
                        fullWidth
                        label="Nombre"
                        value={Linea.name}
                        onChange={(event) => {
                          setLinea({ ...Linea, name: event.target.value });
                        }}
                        name="numberformat"
                        id="formatted-numberformat-input"

                        variant="standard"
                      />
                    </Grid>
                    <Grid xs={6} >
                      <TextField
                        fullWidth
                        label="Telefono"
                        value={Linea.phone}
                        onChange={(event) => {
                          setLinea({ ...Linea, phone: event.target.value });
                        }}
                        name="numberformat"
                        id="formatted-numberformat-input"

                        variant="standard"
                      />
                    </Grid>
                    <Grid xs={12}>
                      <TextField
                        required
                        fullWidth
                        multiline
                        label="Descripción"
                        value={Linea.description}
                        onChange={(event) => {
                          setLinea({ ...Linea, description: event.target.value });
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
                        <MySvgMinibus colorbg={Linea.colorBg} colorpr={Linea.colorPr} />
                      </Grid>
                    </Grid>

                    <Grid container xs={6} >
                      <Grid xs={12} >
                        <MuiColorInput
                          label="Color Superior"
                          variant="standard"
                          format="hex"
                          fullWidth
                          value={'#' + Linea.colorBg}
                          onChange={(color, colors) => {
                            setLinea({ ...Linea, colorBg: colors.hex.slice(1) });
                          }} /></Grid>
                      <Grid xs={12} >
                        <MuiColorInput
                          label="Color Inferior"
                          variant="standard"
                          format="hex"
                          fullWidth
                          value={'#' + Linea.colorPr}
                          onChange={(color, colors) => {
                            setLinea({ ...Linea, colorPr: colors.hex.slice(1) });
                          }} /></Grid>

                    </Grid>
                  </Grid>

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


                </Grid>
              </Box>

            </DialogContent>
            <DialogActions>
              <Button onClick={
                handleCloseDialog}>Cancelar</Button>
              <Button onClick={
                (e) => {
                  if (!Linea.name
                    || !Linea.phone
                    || !Linea.description
                    || !Linea.colorBg
                    || !Linea.colorPr
                    || !Linea.directionLat
                    || !Linea.directionLon) {
                    return enqueueSnackbar("Introduzca todos los datos", { variant: 'error' });
                  }

                  axios.post(urlApi + urlLinea, Linea)
                    .then((response) => {
                      //console.log(JSON.stringify(response));
                      handleCloseDialog();
                      enqueueSnackbar(Linea.name + " creado con exito", { variant: 'success' });
                      setLinea(LineaModelJson)
                    })
                    .catch((e) => {
                      enqueueSnackbar(JSON.stringify(e.response.data.message), { variant: 'error' });
                    });


                }
              }>Crear Linea</Button>
            </DialogActions>
          </Dialog>
        </div>


        <div>
          <Dialog
            open={openDialogEdit}
            onClose={handleCloseDialog}
            scroll={scrollDialog}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
          >
            <DialogTitle id="scroll-dialog-title">
              Editar Linea
            </DialogTitle>
            <DialogContent dividers={scrollDialog === 'paper'}>

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
                      <div style={{ fontSize: '15px' }} >
                        Edita el id, nombre, telefono, descripticion, colores y direccion de la nueva linea
                      </div>
                    </Grid>

                    <Grid xs={4} >
                      <TextField
                        fullWidth
                        disabled
                        label="Id"
                        value={Linea.id}
                        onChange={(event) => {
                          setLinea({ ...Linea, id: event.target.value });
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
                        value={Linea.name}
                        onChange={(event) => {
                          setLinea({ ...Linea, name: event.target.value });
                        }}
                        name="numberformat"
                        id="formatted-numberformat-input"
                        variant="standard"
                      />
                    </Grid>
                    <Grid xs={12}>
                      <TextField
                        fullWidth
                        label="Telefono"
                        value={Linea.phone}
                        onChange={(event) => {
                          setLinea({ ...Linea, phone: event.target.value });
                        }}
                        name="numberformat"
                        id="formatted-numberformat-input"
                        variant="standard"
                      />
                    </Grid>
                    <Grid xs={12}>
                      <TextField
                        required
                        fullWidth
                        multiline
                        label="Descripción"
                        value={Linea.description}
                        onChange={(event) => {
                          setLinea({ ...Linea, description: event.target.value });
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
                        <MySvgMinibus colorbg={Linea.colorBg} colorpr={Linea.colorPr} />
                      </Grid>
                    </Grid>

                    <Grid container xs={6} >
                      <Grid xs={12} >
                        <MuiColorInput
                          label="Color Superior"
                          variant="standard"
                          format="hex"
                          fullWidth
                          value={'#' + Linea.colorBg}
                          onChange={(color, colors) => {
                            setLinea({ ...Linea, colorBg: colors.hex.slice(1) });
                          }} /></Grid>
                      <Grid xs={12} >
                        <MuiColorInput
                          label="Color Inferior"
                          variant="standard"
                          format="hex"
                          fullWidth
                          value={'#' + Linea.colorPr}
                          onChange={(color, colors) => {
                            setLinea({ ...Linea, colorPr: colors.hex.slice(1) });
                          }} /></Grid>

                    </Grid>
                  </Grid>

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


                </Grid>
              </Box>

            </DialogContent>
            <DialogActions>
              <Button onClick={
                handleCloseDialog}>Cancelar</Button>
              <Button onClick={
                (e) => {
                  handleCloseDialog();
                  if (!Linea.id
                    || !Linea.name
                    || !Linea.phone
                    || !Linea.description
                    || !Linea.colorBg
                    || !Linea.colorPr
                    || !Linea.directionLat
                    || !Linea.directionLon) {

                    return enqueueSnackbar("Introduzca todos los datos", { variant: 'error' });
                  }

                  axios.put(urlApi + '/linea/' + Linea.id, Linea)
                    .then((response) => {
                      //console.log(JSON.stringify(response));
                      enqueueSnackbar(Linea.name + " editado con exito", { variant: 'success' });
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
                      setReload(1);
                    })
                    .catch((e) => {
                      enqueueSnackbar(JSON.stringify(e.message), { variant: 'error' });

                    });


                }
              }>Editar Linea</Button>
            </DialogActions>
          </Dialog>
        </div>

        <div>
          <Dialog
            open={openDialogDelete}
            onClose={handleCloseDialog}
            scroll={scrollDialog}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
          >
            <DialogTitle id="scroll-dialog-title">
              Eliminar Linea
            </DialogTitle>
            <DialogContent dividers={scrollDialog === 'paper'}>

              <DialogContentText
                id="scroll-dialog-description"
                ref={descriptionElementRef}
                tabIndex={-1}
              >
                Esta seguro de eliminar la Linea?
              </DialogContentText>

            </DialogContent>
            <DialogActions>
              <Button onClick={
                handleCloseDialog}>Cancelar</Button>
              <Button onClick={
                (e) => {
                  handleCloseDialog();
                  if (Linea.id === ""
                    || Linea.name === ""
                    || Linea.phone === ""
                    || Linea.description === ""
                    || Linea.colorBg === ""
                    || Linea.colorPr === ""
                    || Linea.directionLat === ""
                    || Linea.directionLon === "") {

                    return enqueueSnackbar("Seleccione una linea", { variant: 'error' });
                  }

                  axios.delete(urlApi + '/linea/' + Linea.id).then((response) => {
                    enqueueSnackbar(Linea.name + " eliminado con exito", { variant: 'success' });
                    setReload(1)
                  }).catch((e) => {
                    enqueueSnackbar(JSON.stringify(e.message), { variant: 'error' });
                  });


                }
              }>Eliminar Linea</Button>
            </DialogActions>
          </Dialog>
        </div>


        <Menu
          anchorEl={anchorElMenu}
          open={openMenu}
          onClose={handleCloseMenu}>
          <MenuItem onClick={(e) => {

            setOpenDialogEdit(true);
            setScrollDialog('paper');
            //handleClickOpenDialogEdit('paper');
            setAnchorElMenu(null);

          }}>
            <ListItemIcon>
              <EditRoundedIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit">Editar</Typography>
          </MenuItem>
          <MenuItem onClick={(e) => {
            setOpenDialogDelete(true);
            setScrollDialog('paper');

            setAnchorElMenu(null);

          }}>
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

/*

{Lineas.map((linea) => (
          

          <MySvgMinibus style={{ maxHeight: '50px', backgroundColor: '#c5c5c5' }} colorpr={linea.colorPr} colorbg={linea.colorBg} >

          </MySvgMinibus>

    ))}




<List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {
          Lineas.map((linea) => (

            
            //console.log( linea.name),
            <div key={linea.id} >
            
              <ListItem alignItems="center">
                <MySvgMinibus height={50}  ></MySvgMinibus>
                
                <ListItemText
                  primary={linea.name}
                  secondary={

                    <React.Fragment>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {linea.id}
                      </Typography>
                      <br ></br>
                      {linea.description}
                    </React.Fragment>
                  }
                />
                <IconButton aria-label="comment">
                  <MoreVertRoundedIcon />
                </IconButton>
              </ListItem>
              <Divider variant="inset" component="li" />
            </div>

          ))}
      </List>
*/

/*
<List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {
          Lineas.map((linea) => (

            
            //console.log( linea.name),
            <div key={linea.id} >
            
              <ListItem alignItems="center">
                <MySvgMinibus height={50}  ></MySvgMinibus>
                
                <ListItemText
                  primary={linea.name}
                  secondary={

                    <React.Fragment>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {linea.id}
                      </Typography>
                      <br ></br>
                      {linea.description}
                    </React.Fragment>
                  }
                />
                <IconButton aria-label="comment">
                  <MoreVertRoundedIcon />
                </IconButton>
              </ListItem>
              <Divider variant="inset" component="li" />
            </div>

          ))}
      </List>
*/







