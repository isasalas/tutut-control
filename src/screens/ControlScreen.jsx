import React from 'react'
import { MySvgControl, MySvgControlGps } from '../assets/mySvg'
import MiniDrawer from '../components/mydrawer'
import MyUserScreen from '../components/myUserScreen'
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
  DeleteForeverRounded,
  FilterListRounded,
} from '@mui/icons-material'
import { UserModelJson } from '../models/models';
import { urlApi, urlLinea, urlRole, urlTrabajo, urlUser } from '../api/myApiData';
import { useSnackbar } from 'notistack';
import { MyBanner } from '../components/myBanner';
import { MySearchName } from '../components/MySearch';
import { LineaContext } from '../providers/LineaProvider';

export const ControlScreen = () => {
  //lista principal de todos
  //const [Users, setUsers] = React.useState(Array);
  const [trabajos, setTrabajos] = React.useState(Array);
  const [trabajo, setTrabajo] = React.useState(Array);

  const { linea } = React.useContext(LineaContext)

  //objeto individual
  //const [User, setUser] = React.useState(UserModelJson);
  //
  const [anchorElMenu, setAnchorElMenu] = React.useState(null);

  //estados de los dialogos
  const [openDialogCreate, setOpenDialogCreate] = React.useState(false);
  const [openDialogEdit, setOpenDialogEdit] = React.useState(false);
  const [openDialogDelete, setOpenDialogDelete] = React.useState(false);

  //estado del buscador
  const [searchData, setSearchData] = React.useState({ name: '' });

  const [scrollDialog, setScrollDialog] = React.useState('paper');
  const [reload, setReload] = React.useState();
  const [users, setUsers] = React.useState(false);

  React.useEffect(() => {

    axios.get(urlApi + urlUser)
      .then((response) => {
        const usersFilter = response.data.filter((val) => { if (val.roleId === "2") return val })
        //console.log(JSON.stringify(response));
        //handleCloseDialog();
        setUsers(usersFilter);
        //console.log(usersFilter)

      })

    axios.get(urlApi + urlLinea + urlTrabajo + '/' + linea.id).then((response) => {
      const temp = response.data.trabajos.map((dat) => { return dat.user })
      console.log(temp)
      //setUsers(temp);
      setTrabajos(response.data.trabajos);

    });
    if (openDialogCreate || openDialogEdit || openDialogDelete) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [openDialogCreate, openDialogDelete, openDialogEdit, reload]);

  const descriptionElementRef = React.useRef(null);

  const { enqueueSnackbar } = useSnackbar();

  const openMenu = Boolean(anchorElMenu);

  const handleClickOpenDialogCreate = (scrollType) => () => {
    setTrabajo();
    setOpenDialogCreate(true);
    setScrollDialog(scrollType);
  };


  const handleCloseDialog = () => {
    setOpenDialogCreate(false);
    setOpenDialogEdit(false);
    setOpenDialogDelete(false);
  };


  const handleClickMenu = ({ user, event }) => {
    setAnchorElMenu(event.currentTarget);
    setTrabajo(user);
  };

  const handleCloseMenu = () => {
    setAnchorElMenu(null);
    console.log(JSON.stringify(trabajo))
  };

  const defaultProps = {
    options: users,
    getOptionLabel: (option) => option.id,
  };

  if (!trabajos || !users) return null;
  return (
    <MiniDrawer Contend={


      <Box>
        <MyBanner
          OpenDialogCreate={handleClickOpenDialogCreate}
          MySvg=<MySvgControl />
          MyTitle='Controles'
          MyDescription={'Aqui podras administrar los datos de los usuarios del sistema de la ' + linea.name}
          MyBuutonText='Crear Control'
        />

        <Divider />


        <Grid container columnSpacing={3} >

          {trabajos.filter((val) => {
            if (searchData.name === "") return val
            if (val.user.name.toLowerCase().includes(searchData.name.toLowerCase())) return val

          }).map((trab) => (
            <Grid container
              key={trab.user.id}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              columnSpacing={2}
              xs={12} sm={6} md={4} lg={3} xl={2}>

              <Grid xs={9}>
                <ListItemText
                  primary={<Typography variant="h6">{trab.user.name + " " + trab.user.lastname}</Typography>}
                  secondary={"id: " + trab.user.id} />
              </Grid>

              <Grid xs={1} display="flex" justifyContent="center" alignItems="center">
                <IconButton aria-label="comment" onClick={(e) => {
                  setTrabajo(trab);
                  setOpenDialogDelete(true);
                  setScrollDialog('paper');

                  setAnchorElMenu(null);

                }}>
                  <DeleteForeverRounded />
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
              Crear Control
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

                  <Grid container xs={12} sm={10} >
                    <Grid xs={12}>
                      <div style={{ fontSize: '15px' }} >
                        Introduce los datos del control
                      </div>
                    </Grid>

                    <Grid container alignItems='flex-end' >
                      <FilterListRounded sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                      <Autocomplete
                        onChange={(e, value) => {


                          //console.log(interno);
                          //console.log(JSON.stringify(searchData))
                          if (value) return setTrabajo({ ...trabajo, userId: value.id })
                          return setTrabajo({ ...trabajo, userId: null })
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

                  if (!trabajo.userId) {

                    return enqueueSnackbar("Introduzca todos los datos", { variant: 'error' });
                  }
                  const data = trabajo;
                  data.lineaId=linea.id
                  
                  //setTrabajo({...trabajo, lineaId:linea.id});
                  axios.post(urlApi + urlTrabajo, data)
                    .then((response) => {
                      //console.log(JSON.stringify(response));
                      enqueueSnackbar(" creado con exito", { variant: 'success' });
                      setTrabajo()
                      handleCloseDialog();
                    })
                    .catch((e) => {
                      enqueueSnackbar(JSON.stringify(e.message), { variant: 'error' });

                    });




                }
              }>Crear control</Button>
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
              Eliminar
            </DialogTitle>
            <DialogContent dividers={scrollDialog === 'paper'}>

              <DialogContentText
                id="scroll-dialog-description"
                ref={descriptionElementRef}
                tabIndex={-1}
              >
                Seguro que quieres eliminar este control?
              </DialogContentText>

            </DialogContent>
            <DialogActions>
              <Button onClick={
                handleCloseDialog}>Cancelar</Button>
              <Button onClick={
                (e) => {
                  handleCloseDialog();
                  if (!trabajo.id) {

                    return enqueueSnackbar("Seleccione una linea", { variant: 'error' });
                  }

                  axios.delete(urlApi + urlTrabajo + "/" + trabajo.id).then((response) => {
                    enqueueSnackbar(trabajo.user.name + " eliminado con exito", { variant: 'success' });
                    setReload(1)
                  }).catch((e) => {
                    enqueueSnackbar(JSON.stringify(e.message), { variant: 'error' });
                  });


                }
              }>Eliminar Control</Button>
            </DialogActions>
          </Dialog>
        </div>



      </Box>


    }></MiniDrawer>

  )
}
