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
  Autocomplete,
  Tabs,
  Tab
} from '@mui/material';
import {
  Delete as DeleteIcon,
  EditRounded as EditRoundedIcon,
  SearchRounded as SearchRoundedIcon,
  MoreVertRounded as MoreVertRoundedIcon,
  FilterListRounded as FilterListRoundedIcon
} from '@mui/icons-material'
import {
  MySvgMinibus,
  MySvgLinea
} from '../assets/mySvg';
import { urlApi } from '../api/myApiData';

import { useSnackbar } from 'notistack';
import { RoleModelJson, UserModelJson } from '../models/models';

import PhoneIcon from '@mui/icons-material/Phone';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import PhoneMissedIcon from '@mui/icons-material/PhoneMissed';





const UsuariosScreen = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };



  return (
    <Box container>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="icon position tabs example"
      >
        <Tab icon={<PersonPinIcon />} iconPosition="bottom" label="Pasajero" />
        <Tab icon={<PersonPinIcon />} iconPosition="bottom" label="Conductor" />
        <Tab icon={<PersonPinIcon />} iconPosition="bottom" label="Socio" />
        <Tab icon={<PersonPinIcon />} iconPosition="bottom" label="Control" />
        <Tab icon={<PersonPinIcon />} iconPosition="bottom" label="Admin" />
        <Tab icon={<PersonPinIcon />} iconPosition="bottom" label="Sistema" />

      </Tabs>
    </Box>

  );
}

export default React.memo(UsuariosScreen)









/*


  const [Roles, setRoles] = React.useState(Array);
  const [Role, setRole] = React.useState(RoleModelJson);
  const [Users, setUsers] = React.useState(Array);
  const [User, setUser] = React.useState(UserModelJson);
  const [anchorElMenu, setAnchorElMenu] = React.useState(null);




  const [openDialogCreate, setOpenDialogCreate] = React.useState(false);
  const [openDialogEdit, setOpenDialogEdit] = React.useState(false);
  const [openDialogDelete, setOpenDialogDelete] = React.useState(false);
  const [searchData, setSearchData] = React.useState({ name: '', idrole: '' });

  const [scrollDialog, setScrollDialog] = React.useState('paper');
  const [reload, setReload] = React.useState();

  const { enqueueSnackbar } = useSnackbar();


  const handleClickOpenDialogCreate = (scrollType) => () => {
    setUser(UserModelJson);
    setOpenDialogCreate(true);
    setScrollDialog(scrollType);
  };


  const handleCloseDialog = () => {
    setOpenDialogCreate(false);
    setOpenDialogEdit(false);
    setOpenDialogDelete(false);
  };

  const apiUser = "/user";
  const descriptionElementRef = React.useRef(null);



  React.useEffect(() => {
    axios.get(urlApi + apiUser + "/role").then((response) => {
      setUsers(response.data);
      //console.log(response.data)
    });
    axios.get(urlApi + "/role").then((response) => {
      setRoles(response.data);
      //console.log(response.data)
    });
    if (openDialogCreate) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
    if (openDialogEdit) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
    if (openDialogDelete) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [openDialogCreate, openDialogDelete, openDialogEdit, reload]);

  if (!Users || !Roles) return null;


  const openMenu = Boolean(anchorElMenu);

  const handleClickMenu = ({ user, event }) => {
    setAnchorElMenu(event.currentTarget);
    setUser(user);
  };

  const handleCloseMenu = () => {
    setAnchorElMenu(null);
    console.log(JSON.stringify(User))
  };

  const defaultProps = {
    options: Roles,
    getOptionLabel: (option) => option.name,
  };


  return (
    <Box>
      <Grid container
        paddingBottom={3}
        paddingTop={1}
        direction="row"
        justifyContent="space-evenly"
        alignItems="center"
        columnSpacing={3}
        rowSpacing={0.5}>
        <Grid container
          xs={12}
          sm={4}
          maxWidth={200} >
          <Grid xs={12} >
            <MySvgLinea />
          </Grid>
        </Grid>
        <Grid xs={12} sm={8}>
          <Typography variant="h3">
            <b>Usuarios</b>
          </Typography>
          <div style={{ fontSize: '15px' }} >
            Administre los usuarios del sistema de lineas de transporte publico
          </div>
          <br></br>
          <Button variant="contained"
            //to="/User"
            onClick={handleClickOpenDialogCreate('paper')}
          >
            Crear Nuevo usuario
          </Button>
        </Grid>
      </Grid>

      <Divider />
      <Grid container columnSpacing={3} pb={1} pt={1}>
        <Grid container alignItems='flex-end' >
          <SearchRoundedIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
          <TextField

            label="Buscar"
            placeholder="58"
            variant="standard"
            onChange={(e) => { setSearchData({ ...searchData, name: e.target.value }) }}
          />
        </Grid>
        <Grid container alignItems='flex-end' >
          <FilterListRoundedIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
          <Autocomplete
            onChange={(e, value) => {
              //console.log(value.id);
              console.log(JSON.stringify(searchData))
              if (value) return setSearchData({ ...searchData, idrole: value.id })
              return setSearchData({ ...searchData, idrole: null })
            }}
            {...defaultProps}

            sx={{ width: 180 }}
            renderInput={(params) => (
              <TextField {...params}
                label="Role" variant="standard" />
            )}
          />
        </Grid>

      </Grid>
      <Divider />


      <Grid container columnSpacing={3} >



        {Users.filter((val) => {


          if (searchData.name === "" && searchData.idrole===null) return val


          if (searchData.name !== "" && searchData.idrole===null) {

            if (val.name.toLowerCase().includes(searchData.name.toLowerCase())) {
              return val
            }
          }
          if (searchData.name === "" && searchData.idrole!==null) {
            if (val.roleId === searchData.idrole) return val
          }
          if (searchData.name !== "" && searchData.idrole!==null) {
            if (val.name.toLowerCase().includes(searchData.name.toLowerCase()) && val.roleId === searchData.idrole) {
              return val
            }

          }



          if (searchData.name === "" && !searchData.idrole) return val

          if (val.name.toLowerCase().includes(searchData.name.toLowerCase())) {
            if (!searchData.idrole) return val
            if (val.roleId === searchData.idrole) return val
          }
        }).map((user) => (
          <Grid container
            key={user.id}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            columnSpacing={2}
            xs={12} sm={6} md={4} lg={3} xl={2}>

            <Grid xs={8}>
              <ListItemText
                primary={<Typography variant="h6">{user.name}</Typography>}
                secondary={user.id + " - " + user.role.name} />
            </Grid>

            <Grid xs={1} display="flex" justifyContent="center" alignItems="center">
              <IconButton aria-label="comment" onClick={(e) => {
                //console.log(linea.id);
                handleClickMenu({ event: e, user: user });
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
            Crear Nuevo Usuario
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
                      Introduce el id, nombre, apellido, telefono, correo y rol del nuevo usuario
                    </div>
                  </Grid>

                  <Grid xs={4} >
                    <TextField
                      fullWidth
                      label="Id"
                      value={User.id}
                      onChange={(event) => {
                        setUser({ ...User, id: event.target.value });
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
                      value={User.name}
                      onChange={(event) => {
                        setUser({ ...User, name: event.target.value });
                      }}
                      name="numberformat"
                      id="formatted-numberformat-input"

                      variant="standard"
                    />
                  </Grid>
                  <Grid xs={6} >
                    <TextField
                      fullWidth
                      type="password"

                      label="contrasenia"
                      value={User.password}
                      onChange={(event) => {
                        setUser({ ...User, password: event.target.value });
                      }}
                      name="numberformat"
                      id="formatted-numberformat-input"

                      variant="standard"
                    />
                  </Grid>
                  <Grid xs={6} >
                    <TextField
                      fullWidth
                      type="password"
                      label="Confirma tu contrasenia"
                      value={User.password}
                      onChange={(event) => {
                        setUser({ ...User, password: event.target.value });
                      }}
                      name="numberformat"
                      id="formatted-numberformat-input"

                      variant="standard"
                    />
                  </Grid>

                  <Grid xs={4} >
                    <TextField
                      fullWidth
                      label="Telefono"
                      value={User.lastname}
                      onChange={(event) => {
                        setUser({ ...User, lastname: event.target.value });
                      }}
                      name="numberformat"
                      id="formatted-numberformat-input"

                      variant="standard"
                    />
                  </Grid>

                  <Grid xs={8}>
                    <TextField
                      fullWidth
                      label="email"
                      value={User.email}
                      onChange={(event) => {
                        setUser({ ...User, email: event.target.value });
                      }}
                      name="numberformat"
                      id="formatted-numberformat-input"
                      variant="standard"
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
                if (!User.id
                  || !User.name
                  || !User.lastname
                  || !User.phone
                  || !User.email
                  || !User.password
                  || !User.roleId) {

                  return enqueueSnackbar("Introduzca todos los datos", { variant: 'error' });
                }

                axios.post(urlApi + '/user', User)
                  .then((response) => {
                    //console.log(JSON.stringify(response));
                    enqueueSnackbar(User.name + " creado con exito", { variant: 'success' });
                    setUser(UserModelJson)
                  })
                  .catch((e) => {
                    enqueueSnackbar(JSON.stringify(e.message), { variant: 'error' });

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
                      label="Id"
                      value={User.id}
                      onChange={(event) => {
                        setUser({ ...User, id: event.target.value });
                      }}
                      name="numberformat"
                      id="formatted-numberformat-input"

                      variant="standard"
                    />
                  </Grid>
                  <Grid xs={12}>
                    <TextField
                      fullWidth
                      label="pass"
                      value={User.password}
                      onChange={(event) => {
                        setUser({ ...User, password: event.target.value });
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
                      value={User.name}
                      onChange={(event) => {
                        setUser({ ...User, name: event.target.value });
                      }}
                      name="numberformat"
                      id="formatted-numberformat-input"

                      variant="standard"
                    />
                  </Grid>
                  <Grid xs={8} >
                    <TextField
                      fullWidth
                      label="Apellido"
                      value={User.lastname}
                      onChange={(event) => {
                        setUser({ ...User, lastname: event.target.value });
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
                      value={User.phone}
                      onChange={(event) => {
                        setUser({ ...User, phone: event.target.value });
                      }}
                      name="numberformat"
                      id="formatted-numberformat-input"

                      variant="standard"
                    />
                  </Grid>

                  <Grid xs={12}>
                    <TextField

                      fullWidth

                      label="email"
                      value={User.email}
                      onChange={(event) => {
                        setUser({ ...User, email: event.target.value });
                      }}
                      name="numberformat"
                      id="formatted-numberformat-input"
                      variant="standard"
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
                if (!User.id
                  || !User.name
                  || !User.lastname
                  || !User.phone
                  || !User.email
                  || !User.password
                  || !User.roleId) {

                  return enqueueSnackbar("Introduzca todos los datos", { variant: 'error' });
                }

                axios.put(urlApi + '/user/' + User.id, User)
                  .then((response) => {
                    //console.log(JSON.stringify(response));
                    enqueueSnackbar(User.name + " editado con exito", { variant: 'success' });

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
                if (!User.id
                  || !User.name
                  || !User.lastname
                  || !User.phone
                  || !User.email
                  || !User.password
                  || !User.roleId) {

                  return enqueueSnackbar("Seleccione una linea", { variant: 'error' });
                }

                axios.delete(urlApi + '/user/' + User.id).then((response) => {
                  enqueueSnackbar(User.name + " eliminado con exito", { variant: 'success' });
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



  )
*/