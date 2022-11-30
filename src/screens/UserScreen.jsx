import React from 'react'
import { MySvgControlGps } from '../assets/mySvg'
import MiniDrawer from '../components/mydrawer'
import axios from 'axios';
import {
    Divider, Box, IconButton, ListItemIcon, Typography, ListItemText, TextField, MenuItem, Menu, Unstable_Grid2 as Grid
} from '@mui/material';
import { UserModelJson } from '../models/models';
import { urlApi, urlTrabajo, urlUser } from '../api/myApiData';
import { useSnackbar } from 'notistack';
import { MyBanner } from '../components/myBanner';
import { MySearchName } from '../components/MySearch';
import { Delete, EditRounded, MoreVertRounded } from '@mui/icons-material';
import { MyDialogCreate, MyDialogDelete, MyDialogEdit } from '../components/MyDialogs';
 
const UserScreen = () => {
    const [Users, setUsers] = React.useState(Array);
    const [User, setUser] = React.useState(UserModelJson);
    const [anchorElMenu, setAnchorElMenu] = React.useState(null);
    const [openDialogCreate, setOpenDialogCreate] = React.useState(false);
    const [openDialogEdit, setOpenDialogEdit] = React.useState(false);
    const [openDialogDelete, setOpenDialogDelete] = React.useState(false);
    const [searchData, setSearchData] = React.useState({ name: '' });
    const [scrollDialog, setScrollDialog] = React.useState('paper');

    const descriptionElementRef = React.useRef(null);

    const { enqueueSnackbar } = useSnackbar();

    const openMenu = Boolean(anchorElMenu);

    React.useEffect(() => {
        axios.get(urlApi + urlUser)
            .then((response) => {
                const temp = response.data.filter((dat) => { if (dat.admin === false) return dat });
                setUsers(temp);
            });

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
        setUser(UserModelJson);
        setOpenDialogCreate(false);
        setOpenDialogEdit(false);
        setOpenDialogDelete(false);
    };

    const handleClickMenu = ({ user, event }) => {
        setAnchorElMenu(event.currentTarget);
        setUser(user);
    };

    const handleCloseMenu = () => { setAnchorElMenu(null); };

    const deleteUser = (e) => {
        axios.delete(urlApi + urlUser + '/' + User.id)
            .then((response) => { enqueueSnackbar(User.name + " eliminado con exito", { variant: 'success' }); })
            .catch((e) => { enqueueSnackbar(JSON.stringify(e.response.data.message), { variant: 'error' }); });
        handleCloseDialog();
    }

    const editUser = (e) => {
        if (!User.id || !User.name || !User.lastname || !User.phone || !User.email || !User.password) { return enqueueSnackbar("Introduzca todos los datos", { variant: 'error' }); }
        axios.put(urlApi + urlUser + '/' + User.id, User)
            .then((response) => { enqueueSnackbar(User.name + " editado con exito", { variant: 'success' }); })
            .catch((e) => { enqueueSnackbar(JSON.stringify(e.response.data.message), { variant: 'error' }); });
        handleCloseDialog();
    }

    const createUser = (e) => {
        if (!User.id || !User.name || !User.lastname || !User.phone || !User.email || !User.password || !User.password2) { return enqueueSnackbar("Introduzca todos los datos", { variant: 'error' }); }
        if (User.password !== User.password2) return enqueueSnackbar("Las contraseñas no coinciden", { variant: 'error' });
        User.admin = false;
        delete User.lineaId
        axios.post(urlApi + urlUser, User)
            .then((response) => {
                enqueueSnackbar(User.name + " creado con exito", { variant: 'success' });
                handleCloseDialog();
            })
            .catch((e) => {console.log(User); enqueueSnackbar(JSON.stringify(e.response.data.message), { variant: 'error' }); });
    }

    return (
        <MiniDrawer Contend={
            !Users ? <div>cargando...</div> :
                <Box>
                    <MyBanner
                        OpenDialogCreate={handleClickOpenDialogCreate}
                        MySvg=<MySvgControlGps />
                        MyTitle='Usuario'
                        MyDescription='Aquí podras administrar los datos de los Usuarios del sistema, estos pueden ser conductores y socios. También controles si les asignas ese rol'
                        MyBuutonText='Crear Usuario' />

                    <Divider />
                    <MySearchName searchData={searchData} setSearchData={setSearchData} />
                    <Divider />

                    <Grid container columnSpacing={3} >
                        {Users.filter((val) => {
                            if (searchData.name === "") return val
                            if (val.name.toLowerCase().includes(searchData.name.toLowerCase())) return val
                        }).map((user) => (
                            <Grid container key={user.id} display="flex" justifyContent="space-between" alignItems="center" columnSpacing={2} xs={12} sm={6} md={4} lg={3} xl={2}>
                                <Grid xs={10}>
                                    <ListItemText primary={<Typography variant="h6">{user.name + " " + user.lastname}</Typography>} secondary={"id: " + user.id} />
                                </Grid>
                                <Grid xs={1} display="flex" justifyContent="center" alignItems="center">
                                    <IconButton aria-label="comment" onClick={(e) => { handleClickMenu({ event: e, user: user }); }}>
                                        <MoreVertRounded />
                                    </IconButton>
                                </Grid>
                                <Grid xs={12}>
                                    <Divider variant="mind" />
                                </Grid>
                            </Grid>))}
                    </Grid>

                    <MyDialogCreate Title='Crear Nuevo Usuario' Description='Introduce los datos del nuevo usuario' openDialogCreate={openDialogCreate} handleCloseDialog={handleCloseDialog} scrollDialog={scrollDialog} FuncCreate={createUser}
                        Conten={
                            <Box >
                                <Grid container paddingY={1} justifyContent="space-evenly" alignItems="center" spacing={2}>
                                    <Grid container xs={12} sm={10} >
                                        <Grid xs={4} >
                                            <TextField fullWidth label="Id" variant="standard" value={User.id} onChange={e => setUser({ ...User, id: e.target.value })} />
                                        </Grid>
                                        <Grid xs={8} >
                                            <TextField fullWidth label="Nombre" variant="standard" value={User.name} onChange={e => setUser({ ...User, name: e.target.value })} />
                                        </Grid>
                                        <Grid xs={12} >
                                            <TextField fullWidth label="Apellido" variant="standard" value={User.lastname} onChange={e => setUser({ ...User, lastname: e.target.value })} />
                                        </Grid>
                                        <Grid xs={6} >
                                            <TextField fullWidth type="password" label="Contraseña" variant="standard" value={User.password} onChange={e => setUser({ ...User, password: e.target.value })} />
                                        </Grid>
                                        <Grid xs={6} >
                                            <TextField fullWidth type="password" label="Confirma tu contraseña" variant="standard" value={User.password2} onChange={e => setUser({ ...User, password2: e.target.value })} />
                                        </Grid>
                                        <Grid xs={4} >
                                            <TextField fullWidth label="Telefono" type="number" variant="standard" value={User.phone} onChange={e => setUser({ ...User, phone: e.target.value })} />
                                        </Grid>
                                        <Grid xs={8}>
                                            <TextField fullWidth type="email" label="email" variant="standard" value={User.email} onChange={e => setUser({ ...User, email: e.target.value })} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Box>}

                    />

                    <MyDialogEdit Title='Editar Usuario' Description='Edita los datos del usuario' openDialogEdit={openDialogEdit} handleCloseDialog={handleCloseDialog} scrollDialog={scrollDialog} FuncEdit={editUser}
                        Conten={
                            <Box >
                                <Grid container paddingY={1} justifyContent="space-evenly" alignItems="center" spacing={2}>
                                    <Grid container xs={12} sm={10} >
                                        <Grid xs={4} >
                                            <TextField disabled fullWidth label="Id" variant="standard" value={User.id} onChange={e => setUser({ ...User, id: e.target.value })} />
                                        </Grid>
                                        <Grid xs={8} >
                                            <TextField fullWidth label="Nombre" variant="standard" value={User.name} onChange={e => setUser({ ...User, name: e.target.value })} />
                                        </Grid>
                                        <Grid xs={12} >
                                            <TextField fullWidth label="Apellido" variant="standard" value={User.lastname} onChange={e => setUser({ ...User, lastname: e.target.value })} />
                                        </Grid>
                                        <Grid xs={4} >
                                            <TextField fullWidth label="Telefono" type="number" variant="standard" value={User.phone} onChange={e => setUser({ ...User, phone: e.target.value })} />
                                        </Grid>
                                        <Grid xs={8}>
                                            <TextField fullWidth type="email" label="email" variant="standard" value={User.email} onChange={e => setUser({ ...User, email: e.target.value })} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Box>}
                    />

                    <MyDialogDelete
                        Title='Eliminar Usuario'
                        Description='¿Estás seguro de eliminar este usuario?'
                        openDialogDelete={openDialogDelete}
                        scrollDialog={scrollDialog}
                        FuncDelete={deleteUser}
                        handleCloseDialog={handleCloseDialog}
                    />
                    <Menu
                        anchorEl={anchorElMenu}
                        open={openMenu}
                        onClose={handleCloseMenu}>
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
                            <ListItemIcon> <Delete fontSize="small" /> </ListItemIcon>
                            <Typography variant="inherit" noWrap> Eliminar </Typography>
                        </MenuItem>
                    </Menu>
                </Box>
        }></MiniDrawer>
    )
}
export default UserScreen