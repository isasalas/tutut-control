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
  Unstable_Grid2 as Grid,
  Autocomplete
} from '@mui/material';
import {
  Delete as DeleteIcon,
  EditRounded as EditRoundedIcon,
  SearchRounded as SearchRoundedIcon,
  MoreVertRounded as MoreVertRoundedIcon,
  FilterListRounded
} from '@mui/icons-material'
import {
  MySvgMinibus,
  MySvgLinea
} from '../assets/mySvg';
import { urlApi, urlInterno, urlLinea, urlUser } from '../api/myApiData';
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF
} from '@react-google-maps/api';
import mapStyler from '../assets/maps/myStyleMap'
import { MuiColorInput } from 'mui-color-input'
import { useSnackbar } from 'notistack';
import { LineaModelJson, LineaModel, InternoModelJson } from '../models/models';
import { MySearchName } from '../components/MySearch';
import { MyBanner } from '../components/myBanner';
import MiniDrawer from '../components/mydrawer';
import { SesionContext } from '../providers/SesionProvider';
import { LineaContext } from '../providers/LineaProvider';

/*
const TitleSingular= "Interno";
const TitlePlural= "Internos";
//const Description= "Administra";
const MySvg= ;
const Role= ;
const ButtonCreateLabel= ;
const DialogCreateTitle= ;
const DialogEditTitle= ;
const DialogDeleteTitle= ;
const DialogCreateDescription= ;
const DialogEditDescription= ;
const DialogDeleteDescription= ;*/


const InternoScreen = () => {
  const [anchorElMenu, setAnchorElMenu] = React.useState(null);
  const [Internos, setInternos] = React.useState(Array);
  const [interno, setInterno] = React.useState(InternoModelJson);

  const { sesion } = React.useContext(SesionContext)
  const { linea } = React.useContext(LineaContext)
  const [users, setUsers] = React.useState(false);


  /*
    const { isLoaded } = useJsApiLoader({
      id: 'google-map-script',
      googleMapsApiKey: "AIzaSyBJ7gTWLlIZE3GqIuwwRV1FJnvx2AceHLM"
    })*/

  const { enqueueSnackbar } = useSnackbar();

  const [openDialogCreate, setOpenDialogCreate] = React.useState(false);
  const [openDialogEdit, setOpenDialogEdit] = React.useState(false);
  const [openDialogDelete, setOpenDialogDelete] = React.useState(false);


  const [scrollDialog, setScrollDialog] = React.useState('paper');
  const [reload, setReload] = React.useState();


  const handleClickOpenDialogCreate = (scrollType) => () => {

    //console.log(Interno)    ;
    setOpenDialogCreate(true);
    setScrollDialog(scrollType);
  };
  /*
    const handleClickOpenDialogEdit = (scrollType) => () => {
      setOpenDialogEdit(true);
      setScrollDialog(scrollType);
    };*/

  const handleCloseDialog = () => {
    setInterno(InternoModelJson);
    setOpenDialogCreate(false);
    setOpenDialogEdit(false);
    setOpenDialogDelete(false);
  };


  const descriptionElementRef = React.useRef(null);



  React.useEffect(() => {

    axios.get(urlApi + urlUser)
      .then((response) => {
        const usersFilter = response.data.filter((val) => { if (val.roleId === "2") return val })
        //console.log(JSON.stringify(response));
        //handleCloseDialog();
        setUsers(usersFilter);
        //console.log(usersFilter)

      })
      .catch((e) => {
        enqueueSnackbar(JSON.stringify(e.message), { variant: 'error' });
      });

    axios.get(urlApi + urlInterno)
      .then((response) => {
        const usersFilter = response.data.filter((val) => { if (val.lineaId === linea.id) return val })
        //console.log(JSON.stringify(response));
        //handleCloseDialog();
        setInternos(usersFilter);
        //console.log(usersFilter)

      })
      .catch((e) => {
        enqueueSnackbar(JSON.stringify(e.message), { variant: 'error' });
      });


    if (openDialogCreate || openDialogEdit || openDialogDelete) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }

  }, [openDialogCreate, openDialogDelete, openDialogEdit, reload]);




  const openMenu = Boolean(anchorElMenu);

  const handleClickMenu = ({ data, event }) => {
    setAnchorElMenu(event.currentTarget);
    setInterno(data);


  };
  const handleCloseMenu = () => {
    setAnchorElMenu(null);
    //console.log(JSON.stringify(Linea))
  };

  const defaultProps = {
    options: users,
    getOptionLabel: (option) => option.id,
  };




  if (!linea || !users) return null;

  return (

    <MiniDrawer Contend={
      <Box>
        <MyBanner
          OpenDialogCreate={handleClickOpenDialogCreate}
          MySvg={<MySvgMinibus
            colorpr={linea.colorPr}
            colorbg={linea.colorBg} />}
          MyTitle={"Internos"}
          MyDescription={"Administre los internos de la " + linea.name}
          MyBuutonText={"Crear Nuevo Interno"}
        />
        <Divider />
        {
          //<MySearchName searchData={searchData} setSearchData={setSearchData} />
        }
        <Divider />

        <Grid container columnSpacing={3}>
          {
            Internos.map((data) => (
              <Grid container
                key={data.id}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                columnSpacing={2}
                xs={12} sm={6} md={4} lg={3} xl={2}>


                <Grid xs={2}>
                  <ListItemText
                    primary={<Typography variant="h6">{data.name}</Typography>}
                  />
                </Grid>
                <Grid xs={8} justifyContent="start">
                  <ListItemText secondary={"Id: " + data.id} />
                  <ListItemText secondary={"Socio: " + data.user.id} />
                </Grid>


                <Grid xs={1} display="flex" justifyContent="center" alignItems="center">
                  <IconButton aria-label="comment" onClick={(e) => {
                    //console.log(data.id);
                    handleClickMenu({ event: e, data: data });
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




        {/*crear */}

        <div>

          <Dialog
            open={openDialogCreate}
            onClose={handleCloseDialog}
            scroll={scrollDialog}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
          >
            <DialogTitle id="scroll-dialog-title">
              Crear Nuevo interno
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
                        Introduce el nombre y socio del Interno
                      </div>
                    </Grid>


                    <Grid xs={8} >
                      <TextField
                        fullWidth
                        label="Nombre de interno"
                        value={interno.name}
                        onChange={(event) => {
                          setInterno({ ...interno, name: event.target.value });
                        }}
                        variant="standard"
                      />
                    </Grid>
                    <Grid container alignItems='flex-end' >
                      <FilterListRounded sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                      <Autocomplete
                        onChange={(e, value) => {


                          //console.log(interno);
                          //console.log(JSON.stringify(searchData))
                          if (value) return setInterno({ ...interno, userId: value.id })
                          return setInterno({ ...interno, userId: null })
                        }}
                        {...defaultProps}

                        sx={{ width: 180 }}
                        renderInput={(params) => (
                          <TextField {...params}
                            label="Socio" variant="standard" />
                        )}
                      />
                    </Grid>


                  </Grid>
                </Grid>
              </Box>

            </DialogContent>
            <DialogActions>
              <Button onClick={
                handleCloseDialog}>Cancelar</Button>
              <Button onClick={
                (e) => {

                  if (!interno.name
                    || !interno.userId) {
                    return enqueueSnackbar("Introduzca todos los datos", { variant: 'error' });
                  }
                  const data = interno;
                  delete data.id;
                  delete data.createdAt;
                  delete data.updatedAt;
                  data.lineaId = linea.id;
                  //console.log(interno);
                  console.log(data);
                  axios.post(urlApi + urlInterno, data)
                    .then((response) => {
                      //console.log(JSON.stringify(response));
                      handleCloseDialog();
                      enqueueSnackbar(data.name + " creado con exito", { variant: 'success' });
                    })
                    .catch((e) => {
                      //console.log(e);
                      enqueueSnackbar(JSON.stringify(e.response.data.message), { variant: 'error' });
                    });
                }
              }>Crear Interno</Button>
            </DialogActions>
          </Dialog>
        </div>

        {/*EDITAR */}

        <div>
          <Dialog
            open={openDialogEdit}
            onClose={handleCloseDialog}
            scroll={scrollDialog}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
          >
            <DialogTitle id="scroll-dialog-title">
              Editar Interno
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
                        Edita el id, nombre, linea y socio del Interno
                      </div>
                    </Grid>

                    <Grid xs={4} >
                      <TextField
                        fullWidth
                        disabled
                        label="Id"
                        value={interno.id}
                        variant="standard"
                      />
                    </Grid>
                    <Grid xs={8} >
                      <TextField
                        fullWidth
                        label="Nombre"
                        value={interno.name}
                        onChange={(event) => {
                          setInterno({ ...interno, name: event.target.value });
                        }}
                        variant="standard"
                      />
                    </Grid>
                    <Grid container alignItems='flex-end' >
                      <FilterListRounded sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                      <Autocomplete
                        onChange={(e, value) => {
                          if (value) return setInterno({ ...interno, userId: value.id })
                          return setInterno({ ...interno, userId: null })
                        }}
                        {...defaultProps}
                        defaultValue={() => {
                          const defaultvalue = users.filter((user) => {
                            if (user.id === interno.userId) {
                              console.log(user);
                              return user
                            }
                          });
                          return defaultvalue[0]
                        }
                        }
                        sx={{ width: 180 }}
                        renderInput={(params) => (
                          <TextField {...params}
                            label="Socio" variant="standard" />
                        )}
                      />
                    </Grid>
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
                  if (!interno.name
                    || !interno.userId) {

                    return enqueueSnackbar("Introduzca todos los datos", { variant: 'error' });
                  }
                  console.log(interno);
                  axios.put(urlApi + urlInterno + "/" + interno.id, interno)
                    .then((response) => {
                      //console.log(JSON.stringify(response));
                      enqueueSnackbar(interno.name + " editado con exito", { variant: 'success' });
                      setReload(1);
                    })
                    .catch((e) => {
                      enqueueSnackbar(JSON.stringify(e.response.data.message), { variant: 'error' });

                    });
                }
              }>Editar Interno</Button>
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
              Eliminar Interno
            </DialogTitle>
            <DialogContent dividers={scrollDialog === 'paper'}>

              <DialogContentText
                id="scroll-dialog-description"
                ref={descriptionElementRef}
                tabIndex={-1}
              >
                Esta seguro de eliminar el Interno?
              </DialogContentText>

            </DialogContent>
            <DialogActions>
              <Button onClick={
                handleCloseDialog}>Cancelar</Button>
              <Button onClick={
                (e) => {
                  handleCloseDialog();
                  if (interno.id === "") {
                    return enqueueSnackbar("Seleccione un Interno", { variant: 'error' });
                  }
                  axios.delete(urlApi + urlInterno +"/"+ interno.id).then((response) => {
                    enqueueSnackbar(interno.name + " eliminado con exito", { variant: 'success' });
                    setReload(1)
                  })
                    .catch((e) => {
                      enqueueSnackbar(JSON.stringify(e.response.data.message), { variant: 'error' });
                    });
                }
              }>Eliminar Interno</Button>
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

export default InternoScreen


