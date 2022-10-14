import * as React from 'react'
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
import { MySvgSystem } from '../assets/mySvg';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { urlApi, urlLinea, urlUser } from '../api/myApiData';
import App from '../App';
import { useNavigate } from 'react-router-dom';
import { SesionContext } from '../providers/SesionProvider';
import { random } from '@ctrl/tinycolor';

const LoginScreen = () => {
    const [login, setLogin] = React.useState(UserModelJson);
    const [lineas, setLineas] = React.useState();
    const [reload, setReload] = React.useState();

    const { enqueueSnackbar } = useSnackbar();
    const navigater = useNavigate();
    const { setSesion, sesion } = React.useContext(SesionContext)

    React.useEffect(() => {
        const loginSesion = window.localStorage.getItem('sesion');
        if (loginSesion) {
            setSesion(JSON.parse(loginSesion))
            navigater("/dashboard", { replace: true });
        }
    }, [])

    React.useEffect(() => {
        //setSesion("");
        /*if (!lineas) {
            axios.get(urlApi + urlLinea)
                .then((responseLineas) => {
                    setLineas(responseLineas.data)
                    //console.log(responseLineas.data);
                });
        }*/

        if (sesion) {
            //console.log(sesion)
            

            if (sesion.trabajos.length > 0 || sesion.roleId==="1") {
                window.localStorage.setItem('sesion', JSON.stringify(sesion))

                navigater("/dashboard", { replace: true });
            }
            else {

                enqueueSnackbar("No trabaja en ninguna linea", { variant: 'error' });
                setSesion();
            }
        }

    }, [sesion])



    return (
        <Box sx={{
            display: 'flex',
            p: 3,
        }}>

            <Grid container

                sx={{
                    //backgroundColor: "blue",
                    //width: "100%",
                    flexGrow: 1
                }}
                justifyContent="center"
                alignItems="center"
                columnSpacing={2}
                rowSpacing={2}
            >

                <Grid
                    container
                    p={1}
                    justifyContent="space-evenly"
                    alignItems="center"
                    xs={11} sm={6} md={5} >

                    <Grid
                        xs={12}
                        maxWidth={200} >
                        <Grid xs={12} >
                            <MySvgSystem />
                        </Grid>
                    </Grid>
                    <Grid xs={12} >
                        <Typography variant="h3" textAlign={'center'}>
                            <b>Login</b>
                        </Typography>
                        <div style={{ fontSize: '15px' }} >

                        </div>

                    </Grid>



                    <Grid xs={12} >
                        <TextField
                            fullWidth
                            inputProps={{ style: { textAlign: 'center' } }}
                            label="Identidicador"
                            value={login.id}
                            onChange={(event) => {
                                setLogin({ ...login, id: event.target.value });
                            }}
                            variant="standard"
                        />
                    </Grid>
                    <Grid xs={12}>
                        <TextField
                            fullWidth
                            inputProps={{ style: { textAlign: 'center' } }}
                            type='password'
                            label="Contraseña"
                            value={login.password}
                            onChange={(event) => {
                                setLogin({ ...login, password: event.target.value });
                            }}
                            variant="standard"
                        />
                    </Grid>
                    <Grid>
                        <Button variant="contained"
                            //to="/User"
                            onClick={(e) => {

                                if (!login.id
                                    || !login.password) {

                                    return enqueueSnackbar("Introduzca todos los datos", { variant: 'error' });
                                }
                                //console.log(login);
                                axios.post(urlApi + urlUser + "/login", login)
                                    .then(async (responseUser) => {
                                        setSesion(responseUser.data);
                                        /*var objet = responseUser.data;
                                        //console.log("ola")
                                        //console.log(responseUser.data.trabajos)
                                        objet.trabajos =
                                            responseUser.data.trabajos.map((item) => { return item.linea })

                                        //console.log(objet)
                                        //setSesion(responseUser.data);
                                        //setReload(1);
                                        //console.log(sesion );
                                        if (objet.roleId === "1") {
                                            axios.get(urlApi + urlLinea)
                                                .then((responseLineas) => {
                                                    objet.trabajos = responseLineas.data;
                                                    setSesion(objet);
                                                    // setLineas(responseLineas.data)
                                                    //console.log(responseLineas.data);
                                                });

                                            //setReload(1)
                                            //console.log(sesion );
                                            //navigater("/interno", { replace: true });
                                        }
                                        else {
                                            setSesion(objet);
                                        }*/
                                        //setReload()

                                    })
                                    .catch((e) => {
                                        //console.log(e);

                                        enqueueSnackbar(JSON.stringify(e.response.data.message), { variant: 'error' });

                                    });
                            }
                            }
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