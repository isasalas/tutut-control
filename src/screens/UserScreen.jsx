import React from 'react'
import { MySvgControlGps } from '../assets/mySvg'
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
    Unstable_Grid2 as Grid
} from '@mui/material';
import { UserModelJson } from '../models/models';
import { urlApi, urlRole, urlTrabajo, urlUser } from '../api/myApiData';
import { useSnackbar } from 'notistack';
import { MyBanner } from '../components/myBanner';
import { MySearchName } from '../components/MySearch';
import { Delete, EditRounded, MoreVertRounded } from '@mui/icons-material';

/*
<MyUserScreen 
      ButtonCreateLabel='Crear Usuario' 
      Description='Aqui podras administrar los datos de los Usuarios del sistema'
      DialogCreateDescription='Pon todos los datos'
      DialogCreateTitle='Crear Usuario del sistema'
      DialogDeleteDescription='Seguro que quieres eliminar este usuario?'
      DialogDeleteTitle='Eliminar Usuario del sistema'
      DialogEditDescription='Edita los campos que quieras'
      DialogEditTitle='Editar Usuario del sistema'
      Role='2'
      TitlePlural='Usuario'
      TitleSingular='Usuario'
      MySvg={<MySvgControlGps/>}
      ></MyUserScreen>
*/
const UserScreen = () => {

   //lista principal de todos
   const [Users, setUsers] = React.useState(Array);

   //objeto individual
   const [User, setUser] = React.useState(UserModelJson);
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

   React.useEffect(() => {

       axios.get(urlApi + urlUser+ urlTrabajo ).then((response) => {
        const temp= response.data.filter((dat)=>{
            if(dat.internos.length===0 && dat.trabajos.length===0 && dat.roleId==="2") return dat
        });
        /*const temp= response.data.map((dat)=>{
            if(dat.trabajos.lenght===0) return dat
        });*/

           //console.log(temp)
           //console.log(response.data)
           setUsers(temp);

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
       setUser(UserModelJson);
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
       setUser(user);
   };

   const handleCloseMenu = () => {
       setAnchorElMenu(null);
       console.log(JSON.stringify(User))
   };


   if (!Users) return null;

  return (
    <MiniDrawer Contend={
        

      <Box>
            <MyBanner
                OpenDialogCreate={handleClickOpenDialogCreate}
                MySvg=<MySvgControlGps/>
                MyTitle='Usuario'
                MyDescription='Aqui podras administrar los datos de los Usuarios del sistema'
                MyBuutonText='Crear Usuario'
            />

            <Divider />

            <MySearchName searchData={searchData} setSearchData={setSearchData} />

            <Divider />

            <Grid container columnSpacing={3} >

                {Users.filter((val) => {
                    if (searchData.name === "") return val
                    if (val.name.toLowerCase().includes(searchData.name.toLowerCase())) return val

                }).map((user) => (
                    <Grid container
                        key={user.id}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        columnSpacing={2}
                        xs={12} sm={6} md={4} lg={3} xl={2}>

                        <Grid xs={10}>
                            <ListItemText
                                primary={<Typography variant="h6">{user.name + " " + user.lastname}</Typography>}
                                secondary={"id: " + user.id} />
                        </Grid>
                        <Grid xs={1} display="flex" justifyContent="center" alignItems="center">
                            <IconButton aria-label="comment" onClick={(e) => {
                                //console.log(e);
                                handleClickMenu({ event: e, user: user });
                            }}>
                                <MoreVertRounded/>
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
                    Crear Usuario del sistema
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
                                        Pon todos los datos
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
                                    <Grid xs={12} >
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
                                            value={User.password2}
                                            onChange={(event) => {
                                                setUser({ ...User, password2: event.target.value });
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
                                            type="number"

                                            value={User.phone}
                                            onChange={(event) => {
                                                setUser({ ...User, phone: event.target.value });
                                            }}
                                            name="numberformat"
                                            id="formatted-numberformat-input"

                                            variant="standard"
                                        />
                                    </Grid>

                                    <Grid xs={8}>
                                        <TextField
                                            fullWidth
                                            type="email"
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
                                
                                if (!User.id
                                    || !User.name
                                    || !User.lastname
                                    || !User.phone
                                    || !User.email
                                    || !User.password
                                    || !User.password2) {

                                    return enqueueSnackbar("Introduzca todos los datos", { variant: 'error' });
                                }
                                if (User.password !== User.password2) return enqueueSnackbar("Las contrase;as no coinciden", { variant: 'error' });
                                User.roleId = "2";
                                axios.post(urlApi + urlUser, User)
                                    .then((response) => {
                                        //console.log(JSON.stringify(response));
                                        enqueueSnackbar(User.name + " creado con exito", { variant: 'success' });
                                        setUser(UserModelJson)
                                        handleCloseDialog();
                                    })
                                    .catch((e) => {
                                        enqueueSnackbar(JSON.stringify(e.message), { variant: 'error' });

                                    });




                            }
                        }>Crear Usuario</Button>
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
                        Editar Usuario
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
                                            Edita los campos que decees
                                        </div>
                                    </Grid>

                                    <Grid xs={4} >
                                        <TextField
                                            disabled
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
                                    <Grid xs={12} >
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

                                    <Grid xs={4} >
                                        <TextField
                                            fullWidth
                                            label="Telefono"
                                            type="number"

                                            value={User.phone}
                                            onChange={(event) => {
                                                setUser({ ...User, phone: event.target.value });
                                            }}
                                            name="numberformat"
                                            id="formatted-numberformat-input"

                                            variant="standard"
                                        />
                                    </Grid>

                                    <Grid xs={8}>
                                        <TextField
                                            fullWidth
                                            type="email"
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
                        }>Editar Usuario</Button>
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
                        Eliminar usuario
                    </DialogTitle>
                    <DialogContent dividers={scrollDialog === 'paper'}>

                        <DialogContentText
                            id="scroll-dialog-description"
                            ref={descriptionElementRef}
                            tabIndex={-1}
                        >
                            Estas seguro de eliminar este usuario?
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
                        }>Eliminar Usuario</Button>
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

export default UserScreen