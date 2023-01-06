import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography, Unstable_Grid2 as Grid } from '@mui/material'
import axios from 'axios'
import { useSnackbar } from 'notistack'
import React from 'react'
import { urlApi, urlUser } from '../api/myApiData'
import MiniDrawer from '../components/mydrawer'
import { SesionContext } from '../providers/SesionProvider'

const PerfilScreen = () => {
    const { setSesion, sesion } = React.useContext(SesionContext)
    const [user, setUser] = React.useState(sesion);
    const [pass, setPass] = React.useState({ pass: "", newPass: "", newPass2: "" });

    const { enqueueSnackbar } = useSnackbar();
    const [scrollDialog, setScrollDialog] = React.useState('paper');

    const [openDialogPassword, setOpenDialogPassword] = React.useState(false);
    const [openDialogEdit, setOpenDialogEdit] = React.useState(false);

    const handleCloseDialog = () => {

        setPass({ pass: "", newPass: "", newPass2: "" })
        setOpenDialogPassword(false);
        setOpenDialogEdit(false);
    };

    const FuncEditPass = (e) => {
        if (!pass.pass || !pass.newPass || !pass.newPass2) return enqueueSnackbar("No deje espacios en blanco", { variant: 'error' });
        if (pass.newPass !== pass.newPass2) return enqueueSnackbar("La nueva contraseña esta mal repetida", { variant: 'error' });
        axios.post(urlApi + urlUser + "/login", { id: user.id, password: pass.pass })
            .then((res) => {
                axios.put(urlApi + urlUser + "/" + user.id, { password: pass.newPass })
                    .then((response) => {
                        enqueueSnackbar("Contraseña editada con exito", { variant: 'success' });
                        handleCloseDialog();
                        window.localStorage.removeItem('sesion');
                        setSesion();
                    })
                    .catch((e) => { enqueueSnackbar(JSON.stringify(e.response.data.message), { variant: 'error' }); });
            })
            .catch((e) => {
                //enqueueSnackbar(JSON.stringify(e.response.data.message), { variant: 'error' }) 
                enqueueSnackbar('Contraseña incorrecta.', { variant: 'error' })
            })
    }
    const FuncEdit = (e) => {
        if (!user.name || !user.lastname || !user.phone) return enqueueSnackbar("No deje espacios en blanco", { variant: 'error' });
        axios.post(urlApi + urlUser + "/login", { id: user.id, password: pass.pass })
            .then((res) => {

                axios.put(urlApi + urlUser + "/" + user.id, user)
                    .then((response) => {
                        enqueueSnackbar(user.name + " editado con exito", { variant: 'success' }); handleCloseDialog();
                        response.data = { ...response.data, linea: sesion.linea }
                        setSesion(response.data)
                        setUser(response.data);
                        window.localStorage.setItem('sesion', JSON.stringify(response.data))
                    })
                    .catch((e) => { enqueueSnackbar(JSON.stringify(e.response.data.message), { variant: 'error' }); });
            })
            .catch((e) => {
                //enqueueSnackbar(JSON.stringify(e.response.data.message), { variant: 'error' }) 
                enqueueSnackbar('Contraseña incorrecta.', { variant: 'error' })
            })
    }
 
    return (
        <MiniDrawer Contend={
            <Box height="80vh" display="flex" justifyContent="center" textAlign='center'  >
                <Grid maxWidth={400} flex={1} alignContent='center'  container paddingY={1}  spacing={2}>
                    <Grid container xs={12} >
                        <Grid xs={12}>
                            <Typography variant="h3"> <b>Perfil</b> </Typography>
                            <div style={{ fontSize: '15px' }} >
                                Edita el nombre, apellido, telefono y contraseña del usuario
                            </div>
                        </Grid>
                        <Grid xs={4} >
                            <TextField disabled fullWidth label="Id" variant="standard" value={user.id} />
                        </Grid>
                        <Grid xs={8} >
                            <TextField fullWidth label="Nombre" variant="standard" value={user.name} onChange={e => setUser({ ...user, name: e.target.value })} />
                        </Grid>
                        <Grid xs={12} >
                            <TextField fullWidth label="Apellido" variant="standard" value={user.lastname} onChange={e => setUser({ ...user, lastname: e.target.value })} />
                        </Grid>
                        <Grid xs={12} >
                            <TextField fullWidth label="Telefono" variant="standard" value={user.phone} onChange={e => setUser({ ...user, phone: e.target.value })} />
                        </Grid>

                    </Grid>

                    <Grid xs={12} > 
                        <Button fullWidth  variant="contained"
                            onClick={() => {
                                setOpenDialogEdit(true);
                                setScrollDialog('paper');
                            }}>
                            guardar cambios
                        </Button>
                        <Button fullWidth sx={{ marginTop: '10px' }} variant="contained"
                            onClick={() => {
                                setOpenDialogPassword(true);
                                setScrollDialog('paper');
                            }}>
                            Editar solo contraseña
                        </Button>
                    </Grid>
                </Grid>

                <Dialog open={openDialogPassword} onClose={handleCloseDialog} scroll={scrollDialog} >
                    <DialogTitle children="Editar contraseña" />
                    <DialogContent dividers={scrollDialog === 'paper'}>
                        <DialogContentText tabIndex={-1}>
                            Escribe la contraseña antigua y la nueva
                        </DialogContentText>
                        <Box >
                            <Grid container paddingY={1} justifyContent="space-evenly" alignItems="center" spacing={2} >
                                <Grid container xs={12}  >
                                    <Grid xs={12} >
                                        <TextField fullWidth label="Antigua contraseña" type={'password'} variant="standard" value={pass.pass} onChange={(event) => { setPass({ ...pass, pass: event.target.value }); }} />
                                    </Grid>
                                    <Grid xs={12} sm={6}>
                                        <TextField fullWidth label="Nueva contraseña" type={'password'} variant="standard" value={pass.newPass} onChange={(event) => { setPass({ ...pass, newPass: event.target.value }); }} />
                                    </Grid>
                                    <Grid xs={12} sm={6}>
                                        <TextField fullWidth label="Repite la nueva ontraseña" type={'password'} variant="standard" value={pass.newPass2} onChange={(event) => { setPass({ ...pass, newPass2: event.target.value }); }} />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancelar</Button>
                        <Button onClick={FuncEditPass}>Editar</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={openDialogEdit} onClose={handleCloseDialog} scroll={scrollDialog} >
                    <DialogTitle children={"Editar usuario"} />
                    <DialogContent dividers={scrollDialog === 'paper'}>
                        <DialogContentText tabIndex={-1}>
                            Escribe la contraseña para editar usuario
                        </DialogContentText>
                        <Box >
                            <Grid container paddingY={1} justifyContent="space-evenly" alignItems="center" spacing={2} >
                                <Grid container xs={12}  >
                                    <Grid xs={12} >
                                        <TextField fullWidth label="Contraseña" type={'password'} variant="standard" value={pass.pass} onChange={(event) => { setPass({ ...pass, pass: event.target.value }); }} />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancelar</Button>
                        <Button onClick={FuncEdit}>Editar</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        }></MiniDrawer>
    )
}

export default PerfilScreen