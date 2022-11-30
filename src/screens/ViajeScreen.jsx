import * as React from 'react';
import axios from 'axios';
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, ListItemText, Stack, Switch, TextField, Typography, Unstable_Grid2 as Grid2 } from '@mui/material';
import MiniDrawer from '../components/mydrawer';
import { LineaModelJson, VueltaModelJson } from '../models/models';
import { Add, AddCircle, AddOutlined, Delete, MoreVertRounded, RemoveRedEye } from '@mui/icons-material';
import { urlApi, urlInterno, urlLinea, urlUser, urlVuelta } from '../api/myApiData';
import { MySvgControl } from '../assets/mySvg';
import { DesktopDatePicker, LocalizationProvider, MobileDatePicker, MobileTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { MyDialogDelete } from '../components/MyDialogs';
import { useSnackbar } from 'notistack';
import { SesionContext } from '../providers/SesionProvider';
import Socket from '../components/Socket.io';
import MapView from '../components/MapView';


const ViajeScreen = () => {
  const { sesion } = React.useContext(SesionContext)

  const [ida, setIda] = React.useState(true);

  const [vuelta, setVuelta] = React.useState(VueltaModelJson);
  const [vueltas, setVueltas] = React.useState([]);
  const [linea, setLinea] = React.useState(LineaModelJson);
  const [users, setUsers] = React.useState([]);
  const [date, setDate] = React.useState(dayjs(new Date()));

  const [scrollDialog, setScrollDialog] = React.useState('paper');
  const [openDialogCreate, setOpenDialogCreate] = React.useState(false);
  const [openDialogDelete, setOpenDialogDelete] = React.useState(false);
  const [openDialogView, setOpenDialogView] = React.useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const handleClickOpenDialogCreate = (scrollType) => () => {
    vuelta.datetimeIda = date
    setOpenDialogCreate(true);
    setScrollDialog(scrollType);
  };


  const handleCloseDialog = () => {
    setVuelta(VueltaModelJson);
    setOpenDialogCreate(false);
    setOpenDialogDelete(false);
    setOpenDialogView(false);
  };

  const handleChange = (newValue) => {
    setDate(newValue);
  };

  const defaultPropsUsers = {
    options: users,
    getOptionLabel: (option) => option.id,
  };

  const defaultPropsInternos = {
    options: linea.internos,
    getOptionLabel: (option) => option.name,
  };


  const descriptionElementRef = React.useRef(null);



  React.useEffect(() => {
    axios.get(urlApi + urlVuelta).then((response) => {
      setVueltas(response.data);
      console.log(response.data)
      //console.log('putamadre')
    });

    axios.get(urlApi + urlUser)
      .then((response) => {
        const usersFilter = response.data.filter((val) => { if (val.admin === false && !val.lineaId) return val })
        setUsers(usersFilter);
      })
    axios.get(urlApi + urlLinea + urlInterno + "/" + sesion.lineaId)
      .then((response) => { setLinea(response.data); })
    if (openDialogCreate || openDialogDelete) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) { descriptionElement.focus(); }
    }
  }, [openDialogCreate, openDialogDelete, vuelta]);


  const deleteVuelta = () => {
    axios.delete(urlApi + urlVuelta + "/" + vuelta.id)
      .then((response) => {
        enqueueSnackbar("eliminado con exito", { variant: 'success' });
        handleCloseDialog()
      })
      .catch((e) => { enqueueSnackbar(JSON.stringify(e.response.data.message), { variant: 'error' }); });

  }

  const CreateVuelta = () => {
    if (!vuelta.internoId || !vuelta.userId || !vuelta.datetimeIda || !vuelta.timeParada) return enqueueSnackbar("Introduzca todos los datos", { variant: 'error' });
    const data = vuelta;
    data.ida = linea.ida;
    data.vuelta = linea.vuelta;

    //console.log(data)
    // var minutes=0;
    data.datetimeIda = new Date(data.datetimeIda)//.toISOString()
    data.ida.origin.time = data.datetimeIda.toISOString();
    //console.log(data.datetimeIda);

    data.ida.waypoints = data.ida.waypoints
      .map((e) => {
        if (e.waypoint.stopover === true) {
          e.time = new Date(data.datetimeIda.setMinutes(data.datetimeIda.getMinutes() + e.time)).toISOString();
          //e.time = new Date(e.time).toISOString()
          return e
        } else { return e }
      }
      )

    data.ida.destination.time = new Date(data.datetimeIda.setMinutes(data.datetimeIda.getMinutes() + data.ida.destination.time)).toISOString();

    data.vuelta.origin.time = new Date(data.datetimeIda.setMinutes(data.datetimeIda.getMinutes() + data.timeParada)).toISOString();
    data.vuelta.waypoints = data.vuelta.waypoints
      .map((e) => {
        if (e.waypoint.stopover === true) {
          e.time = new Date(data.datetimeIda.setMinutes(data.datetimeIda.getMinutes() + e.time)).toISOString();
          return e
        } else { return e }
      }
      )
    data.vuelta.destination.time = new Date(data.datetimeIda.setMinutes(data.datetimeIda.getMinutes() + data.vuelta.destination.time)).toISOString();

    delete data.id;
    delete data.datetimeIda;
    delete data.timeParada;
    //console.log(data);


    axios.post(urlApi + urlVuelta, data)
      .then((response) => { enqueueSnackbar("creado con exito", { variant: 'success' }); handleCloseDialog();})
      .catch((e) => { enqueueSnackbar(JSON.stringify(e.response.data.message), { variant: 'error' }); }); 
  }
  return (
    <MiniDrawer Contend={
      <Box >
        <Grid2 container columnSpacing={2} rowSpacing={2} marginBottom={2}>
          <Grid2 container alignItems={'center'} xs={8}>
            <Typography variant="h5" paddingRight={2}> <b>Viajes</b></Typography>
            <IconButton color="success" size="large" onClick={handleClickOpenDialogCreate('paper')}>
              <Add fontSize="inherit" />
            </IconButton>
          </Grid2>
          <Grid2 xs={4} container alignItems={'center'} justifyContent={'right'} >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack spacing={3}>
                <MobileDatePicker
                  inputFormat="MM/DD/YYYY"
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

        <Grid2 container columnSpacing={3}>
          <Grid2 container
            justifyContent="space-between"
            alignItems="center"
            columnSpacing={2}
            xs={12} >
            <Grid2 xs={1}>
              <ListItemText
                secondary={'Int.'} />
            </Grid2>
            <Grid2 xs={3}>
              <ListItemText
                secondary={'Chofer'} />
            </Grid2>
            <Grid2 xs={3}>
              <ListItemText
                secondary={'Inicio'} />
            </Grid2>
            <Grid2 xs={2}>
              <ListItemText
                secondary={'Fin'} />
            </Grid2>
            <Grid2 xs={3} display="flex" justifyContent="end" alignItems="center">
            </Grid2>
            <Grid2 xs={12}>
              <Divider variant="mind" />
            </Grid2>
          </Grid2>
        </Grid2>
        <Grid2 container columnSpacing={3}>
          {vueltas.filter((val) => {
            //console.log(val.ida.origin.time)
            if (new Date(val.ida.origin.time).toDateString() === new Date(date).toDateString()
              && val.interno.lineaId === sesion.lineaId) return val
          }).map((vue) => (
            <Grid2 container
              key={vue.id}
              justifyContent="space-between"
              alignItems="center"
              columnSpacing={2}
              xs={12} >
              <Grid2 xs={1}>
                <ListItemText
                  secondary={vue.interno.name} />
              </Grid2>
              <Grid2 xs={3}>
                <ListItemText
                  secondary={vue.user.name} />
              </Grid2>
              <Grid2 xs={3}>
                <ListItemText
                  secondary={new Date(vue.ida.origin.time).getHours().toString().padStart(2, '0') + ":" + new Date(vue.ida.origin.time).getMinutes().toString().padStart(2, '0')} />
              </Grid2>
              <Grid2 xs={2}>
                <ListItemText
                  secondary={new Date(vue.vuelta.destination.time).getHours().toString().padStart(2, '0') + ":" + new Date(vue.vuelta.destination.time).getMinutes().toString().padStart(2, '0')} />
              </Grid2>
              <Grid2 xs={3} display="flex" justifyContent="end" alignItems="center">
                <IconButton onClick={(e) => { setVuelta(vue); setOpenDialogView(true); setScrollDialog('paper'); }}>
                  <RemoveRedEye />
                </IconButton>
                <IconButton onClick={(e) => { setVuelta(vue); setOpenDialogDelete(true); setScrollDialog('paper'); }}>
                  <Delete />
                </IconButton>
              </Grid2>
              <Grid2 xs={12}>
                <Divider variant="mind" />
              </Grid2>
            </Grid2>
          ))}
        </Grid2>

        <MyDialogDelete Title='Eliminar Viaje' Description='¿Seguro que quieres eliminar este viaje?' openDialogDelete={openDialogDelete} handleCloseDialog={handleCloseDialog} scrollDialog={scrollDialog} FuncDelete={deleteVuelta} />

        <Dialog open={openDialogCreate} onClose={handleCloseDialog} scroll={scrollDialog} >
          <DialogTitle>
            Asignar viaje
          </DialogTitle>
          <DialogContent dividers={scrollDialog === 'paper'}>
            <DialogContentText tabIndex={-1}>
              Selecciona el conductor, el interno, la hora de salida y el tiempo de parada
            </DialogContentText>
            <Box >
              <Grid2 container paddingY={1} justifyContent="space-evenly" alignItems="center" spacing={2}>
                <Grid2 container xs={12} sm={6} >
                  <Grid2 xs={6} >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Stack spacing={3}>
                        <MobileTimePicker
                          //inputFormat="MM/DD/YYYY"
                          label={'Hora de salida'}
                          value={vuelta.datetimeIda}
                          onChange={(newValue) => {
                            console.log(new Date(newValue))
                            setVuelta({ vuelta, datetimeIda: new Date(newValue) });
                          }}
                          renderInput={(params) => <TextField variant='standard' {...params} />}
                        />
                      </Stack>
                    </LocalizationProvider>
                  </Grid2>
                  <Grid2 xs={6} >
                    <TextField fullWidth type='number' label="Tiempo de parada" variant="standard" value={vuelta.timeParada} onChange={e => setVuelta({ ...vuelta, timeParada: Number.parseInt(e.target.value) })} />
                  </Grid2>
                  <Grid2 xs={6}>
                    <Autocomplete
                      sx={{ width: '100%' }}
                      {...defaultPropsUsers}
                      onChange={(e, value) => {
                        if (value) return setVuelta({ ...vuelta, userId: value.id })
                        return setVuelta({ ...vuelta, userId: null })
                      }}
                      renderInput={(params) => (<TextField {...params} label="Conductor" variant="standard" />)}
                    />
                  </Grid2>
                  <Grid2 xs={6}>
                    <Autocomplete
                      sx={{ width: '100%' }}
                      {...defaultPropsInternos}
                      onChange={(e, value) => {
                        if (value) return setVuelta({ ...vuelta, internoId: value.id })
                        return setVuelta({ ...vuelta, internoId: null })
                      }}
                      renderInput={(params) => (<TextField {...params} label="Interno" variant="standard" />)}
                    />
                  </Grid2>
                </Grid2>
              </Grid2>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button onClick={CreateVuelta}>Crear</Button>
          </DialogActions>
        </Dialog>

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
            <MapView viaje={vuelta} ida={ida}></MapView>
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