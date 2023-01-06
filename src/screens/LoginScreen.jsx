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
import logoPng from '../assets/images/logo.png';

const LoginScreen = () => {
    const [login, setLogin] = React.useState(UserModelJson);
    const { setSesion, sesion } = React.useContext(SesionContext)

    const { enqueueSnackbar } = useSnackbar();
    const navigater = useNavigate();

    React.useEffect(() => { SesionCompro() })

    const SesionCompro = () => {
        const loginSesion = JSON.parse(window.localStorage.getItem('sesion'));
        if (loginSesion) {
            axios.get(urlApi + urlUser + "/" + loginSesion.id)
                .then((res) => {
                    if (res.data.admin === true || res.data.controls.length > 0) {
                        navigater("/trabajo", { replace: true });
                        setSesion(loginSesion);
                    } /*else {
                        if (res.data.lineaId) {
                            navigater("/interno", { replace: true });
                            setSesion(loginSesion);
                        }
                        else{
                            console.log('putaaa')
                            navigater("/homeconductor", { replace: true });
                            setSesion(loginSesion);
                        }
                    }*/
                });
        }
    }

    const IniciarSesion = (e) => {
        if (!login.id || !login.password) { return enqueueSnackbar("Introduzca todos los datos por favor.", { variant: 'error' }); }
        axios.post(urlApi + urlUser + "/login", login)
            .then((res) => {
                console.log(res.data)
                if (res.data.admin === true) {
                    window.localStorage.setItem('sesion', JSON.stringify(res.data));
                    SesionCompro()
                } else {
                    if (res.data.controls.length < 1) {
                        enqueueSnackbar('Este usuarios no trabaja en ninguna linea.', { variant: 'error' });
                        /*window.localStorage.setItem('sesion', JSON.stringify(res.data));
                        SesionCompro()*/
                    } else {
                        window.localStorage.setItem('sesion', JSON.stringify(res.data))
                        SesionCompro()
                    }
                }
            })
            .catch((e) => {
                //enqueueSnackbar(JSON.stringify(e.response.data.message), { variant: 'error' }) 
                enqueueSnackbar('Usuario o contraseña incorrectos.', { variant: 'error' })
            })
    }

    return (
        <Box height="100vh" display="flex" justifyContent="center" textAlign='center'>
            <Grid flex={1} alignContent='center' height="100vh" container p={3} spacing={1} xs={11} sm={6} md={5} maxWidth={400} >
                <Grid xs={12} >
                    <Grid xs={12}>
                        <img src={logoPng} alt={"logo"} style={{ width: 150 }} />
                    </Grid>
                </Grid>
                <Grid xs={12}>
                    <Typography fontSize={35} > <b>TuTuT</b> </Typography>
                </Grid>
                <Grid xs={12}>
                    <TextField fullWidth label="Usuario" variant="outlined" value={login.id} 
                        inputProps={{ style: { textAlign: 'center', fontSize: 15 } }}
                        onChange={e => setLogin({ ...login, id: e.target.value })} />
                </Grid>
                <Grid xs={12}>
                    <TextField fullWidth type='password' label="Contraseña" variant="outlined" value={login.password}
                        inputProps={{ style: { textAlign: 'center', fontSize: 15 } }}
                        onChange={e => setLogin({ ...login, password: e.target.value })} />
                </Grid>
                <Grid xs={12}>
                    <Button variant="contained" fullWidth onClick={IniciarSesion} children={"Iniciar Sesión"} />
                </Grid>
            </Grid>
        </Box>
    )
}

export default LoginScreen