import * as React from 'react';
import axios from 'axios';
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, Stack, Switch, TextField, Typography, Unstable_Grid2 as Grid2 } from '@mui/material';
import MiniDrawer from '../components/mydrawer';
import { ViajeModelJson } from '../models/models';
import { Delete, EditRounded, RemoveRedEye } from '@mui/icons-material';
import { urlApi, urlInterno, urlLinea, urlRuta, urlUser, urlViaje } from '../api/myApiData';
import { LocalizationProvider, MobileDatePicker, MobileTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { MyDialogCreate, MyDialogDelete, MyDialogEdit } from '../components/MyDialogs';
import { useSnackbar } from 'notistack';
import { SesionContext } from '../providers/SesionProvider';
import MapView from '../components/MapView';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment';
import refresh from '../assets/images/transporte.png';
import { MyBannerPng } from '../components/myBannerPng';

const ViajeScreen = () => {
  const { sesion } = React.useContext(SesionContext)

  const [ida, setIda] = React.useState(true);

  const [viaje, setViaje] = React.useState(ViajeModelJson);
  const [viajes, setViajes] = React.useState([]);
  const [internos, setInternos] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [date, setDate] = React.useState(dayjs(new Date()));

  const [scrollDialog, setScrollDialog] = React.useState('paper');
  const [openDialogCreate, setOpenDialogCreate] = React.useState(false);
  const [openDialogDelete, setOpenDialogDelete] = React.useState(false);
  const [openDialogView, setOpenDialogView] = React.useState(false);
  const [openDialogEdit, setOpenDialogEdit] = React.useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const descriptionElementRef = React.useRef(null);

  React.useEffect(() => {
    axios.get(urlApi + urlViaje).then((response) => {
      setViajes(response.data.filter(e => (new Date(e.ruta.ida.origin.time).toDateString() === new Date(date).toDateString() && e.ruta.lineaId === sesion.linea.id)));
    });

    axios.get(urlApi + urlUser)
      .then((response) => {
        setUsers(response.data.filter((val) => val.admin === false && !val.lineaId));
      })

    axios.get(urlApi + urlLinea + urlInterno + "/" + sesion.linea.id)
      .then((response) => {
        setInternos(response.data.internos);
      })

    if (openDialogCreate || openDialogDelete || openDialogEdit || openDialogView) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) { descriptionElement.focus(); }
    }
  }, [openDialogCreate, openDialogDelete, openDialogEdit, openDialogView, viaje, date]);

  const handleClickOpenDialogCreate = (scrollType) => () => {
    viaje.datetimeIda = date
    setOpenDialogCreate(true);
    setScrollDialog(scrollType);
  };


  const handleCloseDialog = () => {
    setViaje(ViajeModelJson);
    setOpenDialogCreate(false);
    setOpenDialogEdit(false);
    setOpenDialogDelete(false);
    setOpenDialogView(false);
  };

  const defaultPropsUsers = {
    options: users,
    getOptionLabel: (option) => option.id + " " + option.name + " " + option.lastname,
  };

  const defaultPropsInternos = {
    options: internos,
    getOptionLabel: (option) => option.name,
  };

  const deleteViaje = () => {
    axios.delete(urlApi + urlViaje + "/" + viaje.id)
      .then((response) => {
        enqueueSnackbar("eliminado con exito", { variant: 'success' });
        handleCloseDialog()
      })
      .catch((e) => { enqueueSnackbar(JSON.stringify(e.response.data.message), { variant: 'error' }); });
  }

  const CreateViaje = async () => {
    if (!viaje.internoId || !viaje.userId || !viaje.datetimeIda || !viaje.timeParada) return enqueueSnackbar("Introduzca todos los datos", { variant: 'error' });

    //RUTA
    var ruta = await axios.get(urlApi + urlRuta + urlLinea + "/" + sesion.linea.id)
      .then((re) => { return re.data.find(e => e.status === true); })

    //ASIGNAR DATOS
    var data = viaje;
    data.ruta.id = ruta.id;
    data.ruta.name = ruta.name;
    data.ruta.description = ruta.description;
    data.ruta.lineaId = ruta.lineaId;
    data.ruta.ida = ruta.ida;
    data.ruta.vuelta = ruta.vuelta;

    //IDA
    data.ruta.ida.origin = Object.assign(data.ruta.ida.origin, { marked: null })
    data.datetimeIda = new Date(data.datetimeIda)//.toISOString()
    data.ruta.ida.origin.time = data.datetimeIda.toISOString();

    data.ruta.ida.waypoints = data.ruta.ida.waypoints
      .map((e) => {
        if (e.waypoint.stopover === true) {
          e.time = new Date(data.datetimeIda.setMinutes(data.datetimeIda.getMinutes() + e.time)).toISOString();
          //e.time = new Date(e.time).toISOString()
          e = Object.assign(e, { marked: null })
          return e
        } else { return e }
      }
      )

    data.ruta.ida.destination = Object.assign(data.ruta.ida.destination, { marked: null })
    data.ruta.ida.destination.time = new Date(data.datetimeIda.setMinutes(data.datetimeIda.getMinutes() + data.ruta.ida.destination.time)).toISOString();

    //VUELTA
    data.ruta.vuelta.origin = Object.assign(data.ruta.vuelta.origin, { marked: null })
    data.ruta.vuelta.origin.time = new Date(data.datetimeIda.setMinutes(data.datetimeIda.getMinutes() + data.timeParada)).toISOString();

    data.ruta.vuelta.waypoints = data.ruta.vuelta.waypoints
      .map((e) => {
        if (e.waypoint.stopover === true) {
          e.time = new Date(data.datetimeIda.setMinutes(data.datetimeIda.getMinutes() + e.time)).toISOString();
          e = Object.assign(e, { marked: null })
          return e
        } else { return e }
      }
      )

    data.ruta.vuelta.destination = Object.assign(data.ruta.vuelta.destination, { marked: null })
    data.ruta.vuelta.destination.time = new Date(data.datetimeIda.setMinutes(data.datetimeIda.getMinutes() + data.ruta.vuelta.destination.time)).toISOString();

    //DELETE
    delete data.id;
    delete data.datetimeIda;
    delete data.timeParada;

    console.log(data)
    //GUARDAR
    axios.post(urlApi + urlViaje, data)
      .then((response) => { enqueueSnackbar("Creado con exito", { variant: 'success' }); handleCloseDialog(); })
      .catch((e) => { enqueueSnackbar(JSON.stringify(e.response.data.message), { variant: 'error' }); });
  }

  const editViaje = () => {
    if (!viaje.internoId || !viaje.userId) return enqueueSnackbar("Introduzca todos los datos", { variant: 'error' });

    axios.put(urlApi + urlViaje + "/" + viaje.id, viaje)
      .then((response) => { enqueueSnackbar("Editado con exito", { variant: 'success' }); handleCloseDialog(); })
      .catch((e) => { enqueueSnackbar(JSON.stringify(e.response.data.message), { variant: 'error' }); });

  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 50 },
    {
      field: 'interno',
      headerName: 'Interno',
      description: 'Interno asignado para el viaje.',
      width: 100,
      valueGetter: (dat) => dat.row.interno.name
    },
    {
      field: 'user',
      headerName: 'Conductor',
      description: 'Conductor asignado para el viaje.',
      width: 250,
      valueGetter: (dat) => dat.row.user.name + " " + dat.row.user.lastname
      //type: 'boolean',
    },
    {
      field: 'datetimeIda',
      headerName: 'Hora de inicio',
      description: 'Hora a la que iniciará el viaje.',
      width: 125,
      valueGetter: (dat) => moment(dat.row.ruta.ida.origin.time).format("hh:mm A")
      //type: 'boolean',
    },
    {
      field: 'datetimeVuelta',
      headerName: 'Hora de fin',
      description: 'Hora a la que culminara el viaje.',
      width: 125,
      valueGetter: (dat) => moment(dat.row.ruta.vuelta.destination.time).format("hh:mm A")
      //type: 'boolean',
    },
    {
      field: 'createAt',
      headerName: 'Creado',
      description: 'Fecha de creación del viaje.',
      width: 200,
      valueGetter: (rut) => moment(rut.row.createdAt).format("DD/MM/YYYY hh:mm A")
    },
    {
      field: 'updateAt',
      headerName: 'Editado',
      description: 'Última fecha de edición del viaje.',
      width: 200,
      valueGetter: (rut) => moment(rut.row.updatedAt).format("DD/MM/YYYY hh:mm A")
    },
    {
      field: "action",
      headerName: "Opciones",
      description: 'Opciones para interactuar con los datos del viaje.',
      sortable: false,
      width: 150,
      renderCell: (params) => {
        return <Box>
          <IconButton onClick={(e) => { setViaje(params.row); setOpenDialogView(true); setScrollDialog('paper'); }}>
            <RemoveRedEye />
          </IconButton>
          <IconButton onClick={(e) => { setViaje(params.row); setOpenDialogEdit(true); setScrollDialog('paper'); }}>
            <EditRounded />
          </IconButton>
          <IconButton onClick={(e) => { setViaje(params.row); setOpenDialogDelete(true); setScrollDialog('paper'); }}>
            <Delete />
          </IconButton>
        </Box>;
      }
    },
  ];


  return (
    <MiniDrawer Contend={

      <Box >
        <MyBannerPng
          OpenDialogCreate={handleClickOpenDialogCreate}
          MyPng={refresh}
          MyTitle='Viajes'
          MyDescription={'Aquí podras administrar los viajes de la Linea'}
          MyBuutonText='Crear Viaje' />
        <Divider />
        <Grid2 container alignItems={'center'} justifyContent={'right'} m={1}>

          <Grid2 xs={12} container alignItems={'center'} justifyContent={'right'} >
            <Typography fontSize={15} children={"Escoge la fecha:"} m={1} color={"lightgray"} />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack spacing={3}>
                <MobileDatePicker
                  inputFormat="DD/MM/YYYY"
                  value={date}
                  onChange={(newValue) => {
                    setDate(newValue);
                  }}
                  renderInput={(params) => <TextField sx={{ maxWidth: '95px' }} variant='standard' {...params} />}
                />
              </Stack>
            </LocalizationProvider>
          </Grid2>
        </Grid2>

        <Box sx={{ height: "79vh", width: '100%' }}>
          <DataGrid
            rows={viajes}
            columns={columns}
          />
        </Box>

        <MyDialogDelete Title='Eliminar Viaje' Description='¿Seguro que quieres eliminar este viaje?' openDialogDelete={openDialogDelete} handleCloseDialog={handleCloseDialog} scrollDialog={scrollDialog} FuncDelete={deleteViaje} />

        <MyDialogCreate Title='Asignar viaje' Description='Selecciona el conductor, el interno, la hora de salida y el tiempo de parada' handleCloseDialog={handleCloseDialog} openDialogCreate={openDialogCreate} scrollDialog={scrollDialog} FuncCreate={CreateViaje}
          Conten={
            <Box >
              <Grid2 container spacing={1} justifyContent="space-evenly" alignItems="center" >

                <Grid2 xs={6} >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack spacing={3}>
                      <MobileTimePicker
                        //inputFormat="MM/DD/YYYY"
                        label={'Hora de salida'}
                        value={viaje.datetimeIda}
                        onChange={(newValue) => {
                          //console.log(newValue.toISOString())
                          setViaje({ ...viaje, datetimeIda: newValue.toISOString() });
                        }}
                        renderInput={(params) => <TextField fullWidth variant='standard' {...params} />}
                      />
                    </Stack>
                  </LocalizationProvider>
                </Grid2>
                <Grid2 xs={6} >
                  <TextField fullWidth type='number' label="Tiempo de parada" variant="standard" value={viaje.timeParada} onChange={e => setViaje({ ...viaje, timeParada: Number.parseInt(e.target.value) })} />
                </Grid2>
                <Grid2 xs={6}>
                  <Autocomplete
                    sx={{ width: '100%' }}
                    {...defaultPropsUsers}
                    onChange={(e, value) => {
                      if (value) return setViaje({ ...viaje, userId: value.id })
                      return setViaje({ ...viaje, userId: null })
                    }}
                    renderInput={(params) => (<TextField {...params} label="Conductor" variant="standard" />)}
                  />
                </Grid2>
                <Grid2 xs={6}>
                  <Autocomplete
                    sx={{ width: '100%' }}
                    {...defaultPropsInternos}
                    onChange={(e, value) => {
                      if (value) return setViaje({ ...viaje, internoId: value.id })
                      return setViaje({ ...viaje, internoId: null })
                    }}
                    renderInput={(params) => (<TextField {...params} label="Interno" variant="standard" />)}
                  />
                </Grid2>
              </Grid2>
            </Box>
          }
        >
        </MyDialogCreate>

        <MyDialogEdit Title='Editar viaje' Description='Edita el conductor o el interno del viaje' handleCloseDialog={handleCloseDialog} openDialogEdit={openDialogEdit} scrollDialog={scrollDialog} FuncEdit={editViaje}
          Conten={
            <Box >
              <Grid2 container spacing={1} justifyContent="space-evenly" alignItems="center" >
                <Grid2 xs={6}>
                  <Autocomplete
                    sx={{ width: '100%' }}
                    {...defaultPropsUsers}
                    onChange={(e, value) => {
                      if (value) return setViaje({ ...viaje, userId: value.id })
                      return setViaje({ ...viaje, userId: null })
                    }}
                    renderInput={(params) => (<TextField {...params} label="Conductor" variant="standard" />)}
                  />
                </Grid2>
                <Grid2 xs={6}>
                  <Autocomplete
                    sx={{ width: '100%' }}
                    {...defaultPropsInternos}
                    onChange={(e, value) => {
                      if (value) return setViaje({ ...viaje, internoId: value.id })
                      return setViaje({ ...viaje, internoId: null })
                    }}
                    renderInput={(params) => (<TextField {...params} label="Interno" variant="standard" />)}
                  />
                </Grid2>
              </Grid2>
            </Box>
          }

        >

        </MyDialogEdit>

        <Dialog open={openDialogView} onClose={handleCloseDialog} scroll={scrollDialog} >
          <DialogTitle>
            <Grid2 container alignItems={'center'} >
              <Grid2 xs={6}>
                Ver Viaje
              </Grid2>
              <Grid2 container alignItems={'center'} justifyContent={'end'} xs={6}>
                Ida:
                <Switch checked={ida} onChange={(e) => { setIda(!ida) }} />
              </Grid2>
            </Grid2>
          </DialogTitle>
          <DialogContent dividers={scrollDialog === 'paper'}>
            <DialogContentText tabIndex={-1}>
              Observa el movimiento del interno en su viaje
            </DialogContentText>
            <MapView viaje={viaje} ida={ida}></MapView>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Ok</Button>
          </DialogActions>
        </Dialog>
      </Box>
    } />
  )
}

export default ViajeScreen