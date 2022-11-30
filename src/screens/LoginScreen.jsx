import * as React from 'react'
import {
    Box, Button, Typography, TextField, Unstable_Grid2 as Grid
} from '@mui/material';
import { UserModelJson } from '../models/models';
import { MySvgSystem } from '../assets/mySvg';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { urlApi, urlLinea, urlUser } from '../api/myApiData';
import { useNavigate } from 'react-router-dom';
import { SesionContext } from '../providers/SesionProvider';

const LoginScreen = () => {
    const [login, setLogin] = React.useState(UserModelJson);
    const { setSesion, sesion } = React.useContext(SesionContext)

    const { enqueueSnackbar } = useSnackbar();
    const navigater = useNavigate();

    const SesionCompro = () => {
        const loginSesion = JSON.parse(window.localStorage.getItem('sesion'));
        if (loginSesion) {
            axios.get(urlApi + urlUser + "/" + loginSesion.id)
                .then((res) => {
                   
                    if (res.data.admin === true) {
                        navigater("/dashboard", { replace: true });
                        setSesion(loginSesion);
                    } else {
                        if (res.data.lineaId) {
                            navigater("/interno", { replace: true });
                            setSesion(loginSesion);
                        }
                        /*else{
                            console.log('putaaa')
                            navigater("/homeconductor", { replace: true });
                            setSesion(loginSesion);
                        }*/
                    }
                });
        }
    }

    React.useEffect(() => { SesionCompro() })

    return (
        <Box sx={{ display: 'flex', p: 3, }}>
            <Grid container sx={{ flexGrow: 1 }} justifyContent="center" alignItems="center" spacing={2} >
                <Grid container p={1} justifyContent="space-evenly" alignItems="center" xs={11} sm={6} md={5} >
                    <Grid xs={12} maxWidth={200} >
                        <Grid xs={12} >
                            <MySvgSystem />
                        </Grid>
                    </Grid>
                    <Grid xs={12} >
                        <Typography variant="h3" textAlign={'center'}> <b>Login</b> </Typography>
                    </Grid>
                    <Grid xs={12} >
                        <TextField fullWidth label="Identidicador" variant="standard" value={login.id}
                            inputProps={{ style: { textAlign: 'center' } }}
                            onChange={e => setLogin({ ...login, id: e.target.value })} />
                    </Grid>
                    <Grid xs={12}>
                        <TextField fullWidth type='password' label="Contraseña" variant="standard" value={login.password}
                            inputProps={{ style: { textAlign: 'center' } }}
                            onChange={e => setLogin({ ...login, password: e.target.value })} />
                    </Grid>
                    <Grid>
                        <Button variant="contained"
                            onClick={(e) => {
                                if (!login.id || !login.password) { return enqueueSnackbar("Introduzca todos los datos", { variant: 'error' }); }
                                axios.post(urlApi + urlUser + "/login", login)
                                    .then((res) => {

                                        if (res.data.admin === true) {
                                            window.localStorage.setItem('sesion', JSON.stringify(res.data));
                                            SesionCompro()
                                        } else {
                                            if (!res.data.lineaId) {
                                                enqueueSnackbar('No trabaja en ninguna Linea', { variant: 'error' });
                                                /*window.localStorage.setItem('sesion', JSON.stringify(res.data));
                                                SesionCompro()*/
                                            } else {
                                                window.localStorage.setItem('sesion', JSON.stringify(res.data))
                                                SesionCompro()
                                            }
                                        }
                                    })
                                    .catch((e) => { enqueueSnackbar(JSON.stringify(e.response.data.message), { variant: 'error' }) })
                            }}
                        >
                            Iniciar Sesion
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    )
}

export default LoginScreen