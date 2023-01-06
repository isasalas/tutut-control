import React from 'react'
import { MySvgControl } from '../assets/mySvg'
import MiniDrawer from '../components/mydrawer'
import axios from 'axios';
import {
  Divider, Box, IconButton, Typography, ListItemText, TextField, Unstable_Grid2 as Grid, Autocomplete
} from '@mui/material';
import { DeleteForeverRounded } from '@mui/icons-material'
import { urlApi, urlControl, urlInterno, urlLinea, urlTrabajo, urlUser } from '../api/myApiData';
import { useSnackbar } from 'notistack';
import { MyBannerPng } from '../components/myBannerPng';
import { MyDialogCreate, MyDialogDelete } from '../components/MyDialogs';
import { SesionContext } from '../providers/SesionProvider';
import { UserModelJson } from '../models/models';
import controlPng from '../assets/images/control.png';

export const ControlScreen = () => {
  const [controles, setControles] = React.useState(Array);
  const [Control, setControl] = React.useState(UserModelJson);
  const [openDialogCreate, setOpenDialogCreate] = React.useState(false);
  const [openDialogEdit, setOpenDialogEdit] = React.useState(false);
  const [openDialogDelete, setOpenDialogDelete] = React.useState(false);
  const [scrollDialog, setScrollDialog] = React.useState('paper');
  const [users, setUsers] = React.useState([]);
  const [user, setUser] = React.useState(false);


  const descriptionElementRef = React.useRef(null);

  const { setSesion, sesion } = React.useContext(SesionContext)

  const { enqueueSnackbar } = useSnackbar();

  const defaultProps = { options: users, getOptionLabel: (option) => option.id + " " + option.name + " " + option.lastname, }

  React.useEffect(() => {

    axios.get(urlApi + urlUser)
      .then((response) => {
        //const usersFilter = response.data.filter((val) => { if (val.admin === false && val.lineaId === null && !val.internos[0]) return val })
        setUsers(response.data.filter((val) => { if (val.admin === false) return val }));
      })

    axios.get(urlApi + urlControl + urlLinea + "/" + sesion.linea.id)
      .then((response) => {
        //const usersFilter = response.data.filter((val) => { if (val.admin === false && val.lineaId === null && !val.internos[0]) return val })
        setControles(response.data)
        //.map((e)=>{return e.user}));

      })

    /*axios.get(urlApi + urlLinea + urlUser + '/' + sesion.lineaId)
      .then((response) => { setTrabajos(response.data.users); });*/

    if (openDialogCreate || openDialogEdit || openDialogDelete) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) { descriptionElement.focus(); }
    }
  }, [openDialogCreate, openDialogDelete, openDialogEdit]);

  const handleClickOpenDialogCreate = (scrollType) => () => {
    setOpenDialogCreate(true);
    setScrollDialog(scrollType);
  };

  const handleCloseDialog = () => {
    setControl();
    setOpenDialogCreate(false);
    setOpenDialogEdit(false);
    setOpenDialogDelete(false);
  }

  const deleteControl = (e) => {
    axios.delete(urlApi + urlControl + "/" + Control.id)
      .then((response) => { enqueueSnackbar("Control eliminado con exito", { variant: 'success' }); handleCloseDialog(); })
      .catch((e) => { enqueueSnackbar(JSON.stringify(e.message), { variant: 'error' }); });

  }
  const createControl = (e) => {
    if (!user.id) { return enqueueSnackbar("Selecione al usuario", { variant: 'error' }); }
    axios.post(urlApi + urlControl, { lineaId: sesion.linea.id, userId: user.id })
      .then((response) => { enqueueSnackbar("Control creado con exito", { variant: 'success' }); handleCloseDialog(); })
      .catch((e) => { enqueueSnackbar(JSON.stringify(e.message), { variant: 'error' }); });
  }

  return (
    <MiniDrawer Contend={
      !controles ? <div>cargando...</div> :
        <Box>
          <MyBannerPng
            OpenDialogCreate={handleClickOpenDialogCreate}
            MyPng={controlPng}
            MyTitle='Control'
            MyDescription={'Aquí podras administrar los datos de los usuarios del sistema de la Linea'}
            MyBuutonText='Crear Control' />
          <Divider />
          <Grid container >
            {controles.map((contr) => (
              <Grid container key={contr.user.id} display="flex" justifyContent="space-between" alignItems="center" xs={12} sm={6} md={4} lg={3} xl={2}>
                <Grid xs={0.5} />
                <Grid xs={8}>
                  <ListItemText primary={<Typography variant="h6">{contr.user.name + " " + contr.user.lastname}</Typography>} secondary={"id: " + contr.user.id} />
                </Grid>
                <Grid xs={1} display="flex" justifyContent="center" alignItems="center">
                  <IconButton aria-label="comment" onClick={(e) => { setControl(contr); setOpenDialogDelete(true); setScrollDialog('paper'); }}>
                    <DeleteForeverRounded />
                  </IconButton>
                </Grid>
                <Grid xs={0.5} />
                <Grid xs={12} >
                  <Divider variant="mind" sx={{ marginX: 1 }} />
                </Grid>
              </Grid>))}
          </Grid>

          <MyDialogCreate Title='Crear Nuevo Control' Description='Seleciona al usuario que quieres convertir en control de la linea con la que estás trabajando actualmente' openDialogCreate={openDialogCreate} handleCloseDialog={handleCloseDialog} scrollDialog={scrollDialog} FuncCreate={createControl}
            Conten={
              <Box >
                <Grid container paddingY={1} justifyContent="space-evenly" alignItems="center" spacing={2}>
                  <Grid container xs={12} sm={10}>
                    <Grid xs={12}>
                      <Autocomplete
                        sx={{ width: '100%' }}
                        {...defaultProps}
                        onChange={(e, value) => {
                          if (value) return setUser({ ...Control, id: value.id })
                          return setUser({ ...Control, id: null })
                        }}
                        renderInput={(params) => (<TextField fullWidth {...params} label="Usuario" variant="standard" />)} />
                    </Grid>
                  </Grid>
                </Grid>
              </Box>} />

          <MyDialogDelete Title='Eliminar Control' Description='¿Seguro que quieres quitar el rol de control a este usuario?' openDialogDelete={openDialogDelete} handleCloseDialog={handleCloseDialog} scrollDialog={scrollDialog} FuncDelete={deleteControl} />
        </Box>
    }></MiniDrawer>)
}