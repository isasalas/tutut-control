import React from 'react'
import { MySvgControl } from '../assets/mySvg'
import MiniDrawer from '../components/mydrawer'
import axios from 'axios';
import {
  Divider, Box, IconButton, Typography, ListItemText, TextField, Unstable_Grid2 as Grid, Autocomplete
} from '@mui/material';
import { DeleteForeverRounded } from '@mui/icons-material'
import { urlApi, urlInterno, urlLinea, urlTrabajo, urlUser } from '../api/myApiData';
import { useSnackbar } from 'notistack';
import { MyBanner } from '../components/myBanner';
import { MyDialogCreate, MyDialogDelete } from '../components/MyDialogs';
import { SesionContext } from '../providers/SesionProvider';
import { UserModelJson } from '../models/models';

export const ControlScreen = () => {
  const [trabajos, setTrabajos] = React.useState(Array);
  const [Control, setControl] = React.useState(UserModelJson);
  const [openDialogCreate, setOpenDialogCreate] = React.useState(false);
  const [openDialogEdit, setOpenDialogEdit] = React.useState(false);
  const [openDialogDelete, setOpenDialogDelete] = React.useState(false);
  const [scrollDialog, setScrollDialog] = React.useState('paper');
  const [users, setUsers] = React.useState(false);

  const descriptionElementRef = React.useRef(null);

  const { setSesion, sesion } = React.useContext(SesionContext)

  const { enqueueSnackbar } = useSnackbar();

  const defaultProps = { options: users, getOptionLabel: (option) => option.id, }

  React.useEffect(() => {

    axios.get(urlApi + urlUser + urlInterno)
      .then((response) => {
        const usersFilter = response.data.filter((val) => { if (val.admin === false && val.lineaId === null && !val.internos[0]) return val })
        setUsers(usersFilter);
      })

    axios.get(urlApi + urlLinea + urlUser + '/' + sesion.lineaId)
      .then((response) => { setTrabajos(response.data.users); });

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
    axios.put(urlApi + urlUser + "/" + Control.id, { lineaId: null })
      .then((response) => { enqueueSnackbar(Control.name + " eliminado con exito", { variant: 'success' }); handleCloseDialog(); })
      .catch((e) => { enqueueSnackbar(JSON.stringify(e.message), { variant: 'error' }); });

  }
  const createControl = (e) => {
    if (!Control.id) { return enqueueSnackbar("Introduzca todos los datos", { variant: 'error' }); }
    const data = { lineaId: sesion.lineaId };
    axios.put(urlApi + urlUser + "/" + Control.id, data)
      .then((response) => { enqueueSnackbar(" creado con exito", { variant: 'success' }); handleCloseDialog(); })
      .catch((e) => { enqueueSnackbar(JSON.stringify(e.message), { variant: 'error' }); });
  }

  return (
    <MiniDrawer Contend={
      !trabajos ? <div>cargando...</div> :
        <Box>
          <MyBanner
            OpenDialogCreate={handleClickOpenDialogCreate}
            MySvg=<MySvgControl />
            MyTitle='Controles'
            MyDescription={'Aquí podras administrar los datos de los usuarios del sistema de la Linea'}
            MyBuutonText='Crear Control' />
          <Divider />
          <Grid container columnSpacing={3} >
            {trabajos.map((user) => (
              <Grid container key={user.id} display="flex" justifyContent="space-between" alignItems="center" columnSpacing={2} xs={12} sm={6} md={4} lg={3} xl={2}>
                <Grid xs={9}>
                  <ListItemText primary={<Typography variant="h6">{user.name + " " + user.lastname}</Typography>} secondary={"id: " + user.id} />
                </Grid>
                <Grid xs={1} display="flex" justifyContent="center" alignItems="center">
                  <IconButton aria-label="comment" onClick={(e) => { setControl(user); setOpenDialogDelete(true); setScrollDialog('paper'); }}>
                    <DeleteForeverRounded />
                  </IconButton>
                </Grid>
                <Grid xs={12}>
                  <Divider variant="mind" />
                </Grid>
              </Grid>))}
          </Grid>

          <MyDialogCreate Title='Crear Nuevo Control' Description='Introduce los datos del control' openDialogCreate={openDialogCreate} handleCloseDialog={handleCloseDialog} scrollDialog={scrollDialog} FuncCreate={createControl}
            Conten={
              <Box >
                <Grid container paddingBottom={1} paddingTop={1} justifyContent="space-evenly" alignItems="center" columnSpacing={2} rowSpacing={2}>
                  <Grid container xs={12}>
                    <Grid xs={12}>
                      <Autocomplete
                        sx={{ width: '100%' }}
                        {...defaultProps}
                        onChange={(e, value) => {
                          if (value) return setControl({ ...Control, id: value.id })
                          return setControl({ ...Control, id: null })
                        }}
                        renderInput={(params) => (<TextField {...params} label="Usuario" variant="standard" />)} />
                    </Grid>
                  </Grid>
                </Grid>
              </Box>} />

          <MyDialogDelete Title='Eliminar Control' Description='¿Seguro que quieres quitar el rol de control a este usuario?' openDialogDelete={openDialogDelete} handleCloseDialog={handleCloseDialog} scrollDialog={scrollDialog} FuncDelete={deleteControl} />
        </Box>
    }></MiniDrawer>)
}