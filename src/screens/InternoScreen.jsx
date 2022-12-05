import * as React from 'react';
import axios from 'axios';
import {
  Divider, Box, IconButton, ListItemIcon, Typography, ListItemText, TextField, MenuItem, Menu, Unstable_Grid2 as Grid, Autocomplete
} from '@mui/material';
import {
  Delete, EditRounded, MoreVertRounded, FilterListRounded
} from '@mui/icons-material'
import { MySvgMinibus } from '../assets/mySvg';
import {
  urlApi, urlInterno, urlLinea, urlUser
} from '../api/myApiData';
import { useSnackbar } from 'notistack';
import { InternoModelJson, LineaModelJson } from '../models/models';
import { MyBanner } from '../components/myBanner';
import MiniDrawer from '../components/mydrawer';
import { MyDialogCreate, MyDialogDelete, MyDialogEdit } from '../components/MyDialogs';
import { SesionContext } from '../providers/SesionProvider';


const InternoScreen = () => {
  const {sesion } = React.useContext(SesionContext)

  const [anchorElMenu, setAnchorElMenu] = React.useState(null);
  //const [Internos, setInternos] = React.useState(Array);
  const [interno, setInterno] = React.useState(InternoModelJson);
  const [Linea, setLinea] = React.useState(LineaModelJson);

  const [users, setUsers] = React.useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const [openDialogCreate, setOpenDialogCreate] = React.useState(false);
  const [openDialogEdit, setOpenDialogEdit] = React.useState(false);
  const [openDialogDelete, setOpenDialogDelete] = React.useState(false);


  const [scrollDialog, setScrollDialog] = React.useState('paper');

  const handleClickOpenDialogCreate = (scrollType) => () => {
    setOpenDialogCreate(true);
    setScrollDialog(scrollType);
  };

  const handleCloseDialog = () => {
    setInterno(InternoModelJson);
    setOpenDialogCreate(false);
    setOpenDialogEdit(false);
    setOpenDialogDelete(false);
  };

  const descriptionElementRef = React.useRef(null);
  const openMenu = Boolean(anchorElMenu);

  React.useEffect(() => {

    axios.get(urlApi + urlUser)
    .then((response) => {
      const usersFilter = response.data.filter((val) => { if (val.admin === false && !val.lineaId) return val })
      setUsers(usersFilter);
    }).catch((e) => { enqueueSnackbar(JSON.stringify(e.message), { variant: 'error' }); });

    axios.get(urlApi + urlLinea + urlInterno + "/" + sesion.lineaId)
    .then((response) => {
      //const internoFilter = response.data.internos;
      setLinea(response.data);
    }).catch((e) => { enqueueSnackbar(JSON.stringify(e.message), { variant: 'error' }); });

    if (openDialogCreate || openDialogEdit || openDialogDelete) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) { descriptionElement.focus(); }
    }
  }, [openDialogCreate,openDialogEdit,openDialogDelete]);



  const handleClickMenu = ({ data, event }) => {
    setAnchorElMenu(event.currentTarget);
    setInterno(data);
  };

  const defaultProps = {
    options: users,
    getOptionLabel: (option) => option.id,
  };

  const deleteInterno = (e) => {
     
    axios.delete(urlApi + urlInterno + "/" + interno.id)
      .then((response) => { enqueueSnackbar(interno.name + " eliminado con exito", { variant: 'success' }); handleCloseDialog();})
      .catch((e) => { enqueueSnackbar(JSON.stringify(e.response.data.message), { variant: 'error' }); });
  }

  const editInterno = (e) => {
    
    if (!interno.name || !interno.userId) return enqueueSnackbar("No deje espacios en blanco", { variant: 'error' });
    axios.put(urlApi + urlInterno + "/" + interno.id, interno)
      .then((response) => { enqueueSnackbar(interno.name + " editado con exito", { variant: 'success' }); handleCloseDialog();})
      .catch((e) => { enqueueSnackbar(JSON.stringify(e.response.data.message), { variant: 'error' }); });
  }

  const createInterno = (e) => {
    
    if (!interno.name || !interno.userId) return enqueueSnackbar("Introduzca todos los datos", { variant: 'error' });
    const data = interno;
    delete data.id;
    data.lineaId = sesion.lineaId;
    axios.post(urlApi + urlInterno, data)
      .then((response) => { enqueueSnackbar(data.name + " creado con exito", { variant: 'success' }); handleCloseDialog();})
      .catch((e) => { enqueueSnackbar(JSON.stringify(e.response.data.message), { variant: 'error' }); });
  }

  return (
    <MiniDrawer Contend={
      !Linea ? <div>cargando...</div> :
        <Box >
          <MyBanner
            OpenDialogCreate={handleClickOpenDialogCreate}
            MySvg={<MySvgMinibus top={Linea.color.top} bottom={Linea.color.bottom} />}
            MyTitle={"Internos"}
            MyDescription={"Administre los internos de la " + Linea.name}
            MyBuutonText={"Crear Nuevo Interno"}
          />
          <Divider />
          <Grid container columnSpacing={3} >
            {Linea.internos.map((data) => (
              <Grid container key={data.id} display="flex" justifyContent="space-between" alignItems="center" columnSpacing={2} xs={12} sm={6} md={4} lg={3} xl={2}>
                <Grid xs={2}>
                  <ListItemText primary={<Typography variant="h6">{data.name}</Typography>} />
                </Grid>
                <Grid xs={8} justifyContent="start">
                  <ListItemText secondary={"Id: " + data.id} />
                  <ListItemText secondary={"Socio: " + data.user.id} />
                </Grid>
                <Grid xs={1} display="flex" justifyContent="center" alignItems="center">
                  <IconButton aria-label="comment" onClick={(e) => { handleClickMenu({ event: e, data: data }); }}>
                    <MoreVertRounded />
                  </IconButton>
                </Grid>
                <Grid xs={12}>
                  <Divider variant="mind" />
                </Grid>
              </Grid>
            ))}
          </Grid>

          <MyDialogCreate Title='Crear Nuevo Interno' Description='Introduce el nombre del interno y socio' openDialogCreate={openDialogCreate} handleCloseDialog={handleCloseDialog} scrollDialog={scrollDialog} FuncCreate={createInterno}
            Conten={
              <Box >
                <Grid container paddingY={1} justifyContent="space-evenly" alignItems="center" spacing={2} >
                  <Grid container xs={12}  >
                    <Grid xs={12} sm={3}>
                      <TextField fullWidth type='number' label="Interno" variant="standard" value={interno.name} onChange={e => setInterno({ ...interno, name: e.target.value })} />
                    </Grid>
                    <Grid xs={12} sm={9} container alignItems='flex-end' >
                      <Grid xs={12}>
                        <Autocomplete
                          sx={{ width: '100%' }}
                          {...defaultProps}
                          onChange={(e, value) => {
                            if (value) return setInterno({ ...interno, userId: value.id })
                            return setInterno({ ...interno, userId: null })
                          }}
                          renderInput={(params) => (<TextField {...params} label="Socio" variant="standard" />)}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>} />

          <MyDialogEdit Title='Editar Interno' Description='Edita el nombre del Interno y socio' openDialogEdit={openDialogEdit} handleCloseDialog={handleCloseDialog} scrollDialog={scrollDialog} FuncEdit={editInterno}
            Conten={
              <Box >
                <Grid container paddingY={1} justifyContent="space-evenly" alignItems="center" spacing={2} >
                  <Grid container xs={12} sm={6} >
                    <Grid xs={4} >
                      <TextField fullWidth disabled label="Id" value={interno.id} variant="standard" />
                    </Grid>
                    <Grid xs={8} >
                      <TextField fullWidth label="Nombre" value={interno.name} onChange={(event) => { setInterno({ ...interno, name: event.target.value }); }} variant="standard" />
                    </Grid>
                    <Grid container alignItems='flex-end' >
                      <FilterListRounded sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                      <Autocomplete
                        sx={{ width: 180 }}
                        onChange={(e, value) => {
                          if (value) return setInterno({ ...interno, userId: value.id })
                          return setInterno({ ...interno, userId: null })
                        }}
                        {...defaultProps}
                        renderInput={(params) => (<TextField {...params} label="Socio" variant="standard" />)}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Box>} />

          <MyDialogDelete Title='Eliminar Interno' Description='¿Estas seguro de eliminar el Interno?' openDialogDelete={openDialogDelete} handleCloseDialog={handleCloseDialog} scrollDialog={scrollDialog} FuncDelete={deleteInterno} />

          <Menu anchorEl={anchorElMenu} open={openMenu} onClose={() => { setAnchorElMenu(null) }}>
            <MenuItem onClick={(e) => {
              setOpenDialogEdit(true);
              setScrollDialog('paper');
              setAnchorElMenu(null);
            }}>
              <ListItemIcon>
                <EditRounded fontSize="small" />
              </ListItemIcon>
              <Typography variant="inherit">Editar</Typography>
            </MenuItem>
            <MenuItem onClick={(e) => {
              setOpenDialogDelete(true);
              setScrollDialog('paper');
              setAnchorElMenu(null);
            }}>
              <ListItemIcon>
                <Delete fontSize="small" />
              </ListItemIcon>
              <Typography variant="inherit" noWrap> Eliminar </Typography>
            </MenuItem>
          </Menu>
        </Box>
    }></MiniDrawer>
  )
}
export default InternoScreen