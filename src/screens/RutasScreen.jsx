import * as React from 'react';
import axios from 'axios';
import {
  Box, Button, Divider, TextField, Typography, Unstable_Grid2 as Grid2, InputAdornment, Switch, Autocomplete, IconButton, ListItemText
} from '@mui/material';
import {
  Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineDot, TimelineOppositeContent, TimelineContent, timelineOppositeContentClasses
} from '@mui/lab';
import MiniDrawer from '../components/mydrawer';
import { GoogleMap } from '@react-google-maps/api';
import { urlApi, urlLinea, urlRuta } from '../api/myApiData';
import { SesionContext } from '../providers/SesionProvider';
import { LineaModelJson, RutaModelJson } from '../models/models';
import { useSnackbar } from 'notistack';
import { MyBannerPng } from '../components/myBannerPng';
import { MySvgLinea, SvgPin } from '../assets/mySvg';
import { MyDialogCreate, MyDialogDelete, MyDialogEdit } from '../components/MyDialogs';
import { Beenhere, Check, CheckCircle, Delete, EditRounded, Save } from '@mui/icons-material';
import RutasView from '../components/RutasView';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment';
import rutaPng from '../assets/images/maps.png';


let dirSerIda, dirRenIda, dirSerVuelta, dirRenVuelta;
let alphabet = 'ABCDEFGHIJKLMNOPQRSTUXYZ';
let defaultLocation = { lat: -17.783598, lng: -63.180524 };

const RutasScreen = () => {
  const { sesion } = React.useContext(SesionContext)
  //const [dirSer, setDirSer] = React.useState({ dirSerIda: null, dirRenIda: null, dirSerVuelta: null, dirRenVuelta: null })
  const [ruta, setRuta] = React.useState(RutaModelJson)
  //const [newRuta, setNewRuta] = React.useState(RutaModelJson)
  const [rutas, setRutas] = React.useState([])
  const [SwitchOn, setSwitchOn] = React.useState({
    on: true,
    label: "Ruta de Ida",
    displayIda: 'flex',
    displayVuelta: 'none'
  })

  const [openDialogCreate, setOpenDialogCreate] = React.useState(false);
  const [openDialogEdit, setOpenDialogEdit] = React.useState(false);
  const [openDialogDelete, setOpenDialogDelete] = React.useState(false);
  const [openDialogActivate, setOpenDialogActivate] = React.useState(false);

  const [scrollDialog, setScrollDialog] = React.useState('paper');
  const [activeButton, setActiveButton] = React.useState('none');

  const { enqueueSnackbar } = useSnackbar();

  const defaultProps = { options: rutas, getOptionLabel: (option) => option.id + " " + option.name }

  var indiceParadaIda = 1
  var indiceParadaVuelta = 1

  React.useEffect(() => {
    actualizarLista()
  }, [])

  React.useEffect(() => {
    if (ruta.status === true) setActiveButton("none")
    else setActiveButton("flex")
  }, [ruta, SwitchOn])

  const handleClickOpenDialogCreate = (scrollType) => () => {
    setOpenDialogCreate(true);
    setScrollDialog(scrollType);
  };

  const actualizarLista = () => {
    axios.get(urlApi + urlRuta + urlLinea + "/" + sesion.linea.id)
      .then((re) => {
        //setRuta(re.data.find(e => e.status === true));
        setRutas(re.data);
      })
  }

  const handleCloseDialog = () => {
    setRuta(RutaModelJson);
    setOpenDialogCreate(false);
    setOpenDialogEdit(false);
    setOpenDialogDelete(false);
    setOpenDialogActivate(false)
  };

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

  const createRuta = () => {
    if (!ruta.name
      || !ruta.description) {
      return enqueueSnackbar("Introduzca todos los datos", { variant: 'error' });
    }
    const dat = ruta;
    delete dat.id
    dat.lineaId = sesion.linea.id
    dat.status = false
    axios.post(urlApi + urlRuta, dat)
      .then((response) => {
        enqueueSnackbar(ruta.name + " creado con exito", { variant: 'success' });
        handleCloseDialog();
        setRuta({ ...ruta, id: null })
        actualizarLista()
      }).catch((e) => { enqueueSnackbar(JSON.stringify(e.response.data.message), { variant: 'error' }); });
  }
  const editRuta = () => {
    if (!ruta.name
      || !ruta.description) {
      return enqueueSnackbar("Introduzca todos los datos", { variant: 'error' });
    }
    console.log(ruta.ida)
    console.log(ruta.vuelta)
    axios.put(urlApi + urlRuta + "/" + ruta.id, { ida: ruta.ida, vuelta: ruta.vuelta })
      .then((re) => {
        enqueueSnackbar("editado con exito", { variant: 'success' });
        handleCloseDialog();
        setRuta(re.data);
      })
      .catch((e) => { enqueueSnackbar(JSON.stringify(e.message), { variant: 'error' }); })
  }

  const deleteRuta = () => {
    if (ruta.status === true) return enqueueSnackbar("Esta ruta está activa, activa otra primero para eliminar", { variant: 'error' });
    axios.delete(urlApi + urlRuta + "/" + ruta.id)
      .then((response) => {
        enqueueSnackbar(ruta.name + " eliminado con exito", { variant: 'success' });
        handleCloseDialog();
        actualizarLista()
      }).catch((e) => { enqueueSnackbar(JSON.stringify(e.response.data.message), { variant: 'error' }); });
  }

  const activateRuta = () => {
    axios.get(urlApi + urlRuta + "/" + ruta.id + "/" + sesion.linea.id)
      .then((re) => {
        enqueueSnackbar("activado con exito", { variant: 'success' });
        handleCloseDialog();
        actualizarLista()
      })
      .catch((e) => { enqueueSnackbar(JSON.stringify(e.message), { variant: 'error' }); })
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 50 },
    {
      field: 'name',
      headerName: 'Nombre',
      description: 'Nombre asignado a la ruta.',
      width: 150,
      editable: true,
    },
    {
      field: 'description',
      headerName: 'Decripción',
      description: 'Decripción de la ruta.',
      width: 350,
      editable: true,
    },
    {
      field: 'status',
      headerName: 'Activo',
      description: 'Solo puede aver una ruta activa para cada linea.',
      width: 100,
      //valueGetter: (rut) =>{ if(rut.row.status===true) {return "activo"}else{return "inactivo"}}
      type: 'boolean',
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
      description: 'Opciones para interactuar con los datos de la ruta.',
      sortable: false,
      width: 150,
      renderCell: (params) => {
        return <Box>
          <IconButton name='olas' onClick={(e) => { setRuta(params.row); setOpenDialogEdit(true); setScrollDialog('paper'); }}>
            <EditRounded />
          </IconButton>
          <IconButton onClick={(e) => { setRuta(params.row); setOpenDialogDelete(true); setScrollDialog('paper'); }}>
            <Delete />
          </IconButton>
          {params.row.status === true ? null : <IconButton onClick={(e) => { setRuta(params.row); setOpenDialogActivate(true); setScrollDialog('paper'); }}>
            <Check />
          </IconButton>}
        </Box>;
      }
    },
  ];

  return (
    <MiniDrawer Contend={


      <Box >
        <MyBannerPng
          OpenDialogCreate={handleClickOpenDialogCreate}
          MyPng={rutaPng}
          MyTitle='Rutas'
          MyDescription={'Aquí podras administrar las rutas de la Linea'}
          MyBuutonText='Crear Ruta' />
        


        <Box sx={{ height: "83vh", width: '100%' }}>
          <DataGrid

            rows={rutas}
            columns={columns}
          />
        </Box>

        <MyDialogCreate Title='Crear Nueva Ruta' Description='Escribe el nombre, la descripción, edita la ubicación y los tiempos entre paradas de la nueva ruta' openDialogCreate={openDialogCreate} handleCloseDialog={handleCloseDialog} scrollDialog={scrollDialog} FuncCreate={createRuta}
          Conten={
            <Box >
              <Grid2 container rowSpacing={1} justifyContent="space-evenly" alignItems="center" >
                <Grid2 container xs={12} sm={2.7} >
                  <TextField fullWidth label="Nombre" variant="standard" value={ruta.name} onChange={e => setRuta({ ...ruta, name: e.target.value })} />
                </Grid2>
                <Grid2 container xs={0} sm={0.3} >
                </Grid2>
                <Grid2 xs={12} sm={5} >
                  <TextField fullWidth label="Descripción" variant="standard" value={ruta.description} onChange={e => setRuta({ ...ruta, description: e.target.value })} />
                </Grid2>
                <Grid2 container xs={4} sm={4} textAlign={'center'} >
                  <Grid2 xs={12} fontSize={12} color={'lightgray'}>
                    {SwitchOn.label}
                  </Grid2>
                  <Grid2 xs={12} >
                    <Switch checked={SwitchOn.on} onChange={switchChange} name="gilad" />
                  </Grid2>
                </Grid2>
                <Grid2 xs={12} >
                  <RutasView SwitchOn={SwitchOn} ruta={ruta} setRuta={setRuta} />
                </Grid2>
              </Grid2>
            </Box>
          } />

        <MyDialogEdit Title='Editar Linea' Description='Edita los datos de la ruta a continuación' openDialogEdit={openDialogEdit} handleCloseDialog={handleCloseDialog} scrollDialog={scrollDialog} FuncEdit={editRuta}
          Conten={
            <Box >
              <Grid2 container rowSpacing={1} justifyContent="space-evenly" alignItems="center" >
                <Grid2 container xs={12} sm={2.7} >
                  <TextField fullWidth label="Nombre" variant="standard" value={ruta.name} onChange={e => setRuta({ ...ruta, name: e.target.value })} />
                </Grid2>
                <Grid2 container xs={0} sm={0.3} >
                </Grid2>
                <Grid2 xs={12} sm={5} >
                  <TextField fullWidth label="Descripción" variant="standard" value={ruta.description} onChange={e => setRuta({ ...ruta, description: e.target.value })} />
                </Grid2>
                <Grid2 container xs={4} sm={4} textAlign={'center'} >
                  <Grid2 xs={12} fontSize={12} color={'lightgray'}>
                    {SwitchOn.label}
                  </Grid2>
                  <Grid2 xs={12} >
                    <Switch checked={SwitchOn.on} onChange={switchChange} name="gilad" />
                  </Grid2>
                </Grid2>
                <Grid2 xs={12} >
                  <RutasView SwitchOn={SwitchOn} ruta={ruta} setRuta={setRuta} />
                </Grid2>
              </Grid2>
            </Box>
          }
        />
        <MyDialogEdit Title='Activar ruta' Description={`¿Estás seguro de poner la ruta "${ruta.name}" como la principal?`} openDialogEdit={openDialogActivate} handleCloseDialog={handleCloseDialog} scrollDialog={scrollDialog} FuncEdit={activateRuta} />
        <MyDialogDelete Title='Eliminar ruta' Description={`¿Estás seguro de eliminar la ruta "${ruta.name}"?`} openDialogDelete={openDialogDelete} handleCloseDialog={handleCloseDialog} scrollDialog={scrollDialog} FuncDelete={deleteRuta} />

      </Box>
    } />
  )
}

export default RutasScreen