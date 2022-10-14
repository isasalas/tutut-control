import React from 'react'
import { Button, TextField, Typography, Unstable_Grid2 as Grid } from '@mui/material'
import { Box } from '@mui/system';
import PropTypes from 'prop-types';


export const MyDialogUserCreate = (props) => {
    const User = props.User;
    const setUser = props.setUser;

    return (
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
                            Introduce el id, nombre, apellido, telefono, correo y rol del nuevo pasajero
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

    )
}

MyDialogUserCreate.propTypes = {
    setUser: PropTypes.func.isRequired,
    User: PropTypes.object.isRequired,
};


export const MyDialogUserEdit = (props) => {
    const User = props.User;
    const setUser = props.setUser;

    return (
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
                            Introduce el id, nombre, apellido, telefono, correo y rol del nuevo pasajero
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

    )
}

MyDialogUserEdit.propTypes = {
    setUser: PropTypes.func.isRequired,
    User: PropTypes.object.isRequired,
};