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
    Unstable_Grid2 as Grid
} from '@mui/material';
import {
    Delete as DeleteIcon,
    EditRounded as EditRoundedIcon,
    SearchRounded as SearchRoundedIcon,
    MoreVertRounded as MoreVertRoundedIcon,
} from '@mui/icons-material'
import {
    MySvgMinibus,
    MySvgLinea
} from '../assets/mySvg';
import { urlApi, urlRole, urlUser } from '../api/myApiData';

import { useSnackbar } from 'notistack';
import { RoleModelJson, UserModelJson } from '../models/models';
import { MyBanner } from '../components/myBanner';
import { MySearchName } from '../components/MySearch';
import { MyDialogUserCreate, MyDialogUserEdit } from '../components/myDialogUser';






const PasajeroScreen = () => {

    const [Pasajeros, setPasajeros] = React.useState(Array);

    const [User, setUser] = React.useState(UserModelJson);
    const [anchorElMenu, setAnchorElMenu] = React.useState(null);

    const [openDialogCreate, setOpenDialogCreate] = React.useState(false);
    const [openDialogEdit, setOpenDialogEdit] = React.useState(false);
    const [openDialogDelete, setOpenDialogDelete] = React.useState(false);
    const [searchData, setSearchData] = React.useState({ name: '' });

    const [scrollDialog, setScrollDialog] = React.useState('paper');
    const [reload, setReload] = React.useState();

    React.useEffect(() => {
        axios.get(urlApi + urlRole + urlUser + "/6").then((response) => {
            console.log(response.data.users)
            console.log(response.data)
            setPasajeros(response.data.users);

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


    if (!Pasajeros) return null;

    return (

        <Box>
            <MyBanner
                OpenDialogCreate={handleClickOpenDialogCreate}
                MySvg={MySvgLinea}
                MyTitle={"Pasajeros"}
                MyDescription={"Administre los pasajeros del sistema"}
                MyBuutonText={"Crear nuevo Pasajero"}
            />

            <Divider />

            <MySearchName searchData={searchData} setSearchData={setSearchData} />

            <Divider />

            <Grid container columnSpacing={3} >

                {Pasajeros.filter((val) => {
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

                        <Grid xs={8}>
                            <ListItemText
                                primary={<Typography variant="h6">{user.name + " " + user.lastname}</Typography>}
                                secondary={"id: " + user.id} />
                        </Grid>

                        <Grid xs={1} display="flex" justifyContent="center" alignItems="center">
                            <IconButton aria-label="comment" onClick={(e) => {
                                console.log(e);
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
                        Crear Nuevo Pasajero
                    </DialogTitle>
                    <DialogContent dividers={scrollDialog === 'paper'}>

                        <MyDialogUserCreate User={User} setUser={setUser} />

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
                                    || !User.password2) {

                                    return enqueueSnackbar("Introduzca todos los datos", { variant: 'error' });
                                }
                                if (User.password !== User.password2) return enqueueSnackbar("Las contrase;as no coinciden", { variant: 'error' });
                                User.roleId = 6;
                                axios.post(urlApi + urlUser, User)
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

                        <MyDialogUserEdit User={User} setUser={setUser} />

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
}

export default PasajeroScreen