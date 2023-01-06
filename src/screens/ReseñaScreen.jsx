import { Box, Divider, IconButton, Tab, Tabs, Unstable_Grid2 as Grid2 } from '@mui/material'
import React from 'react'
import { SvgComents } from '../assets/mySvg'
import { MyBannerPng } from '../components/myBannerPng'
import MiniDrawer from '../components/mydrawer'
import reseñaPng from '../assets/images/chat.png';
import axios from 'axios'
import { urlApi, urlReseña, urlUser } from '../api/myApiData'
import { ReseñaModelJson } from '../models/models'

import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { DataGrid } from '@mui/x-data-grid'
import { Delete, EditRounded } from '@mui/icons-material'
import moment from 'moment';


const ReseñaScreen = () => {

    const [reseñas, setReseñas] = React.useState([]);
    const [reseña, setReseña] = React.useState(ReseñaModelJson);
    const [users, setUsers] = React.useState([]);
    const [internos, setInternos] = React.useState([]);

    const [openDialogCreate, setOpenDialogCreate] = React.useState(false);
    const [openDialogEdit, setOpenDialogEdit] = React.useState(false);
    const [openDialogDelete, setOpenDialogDelete] = React.useState(false);
    const [scrollDialog, setScrollDialog] = React.useState('paper');

    const descriptionElementRef = React.useRef(null);


    const handleClickOpenDialogCreate = (scrollType) => () => {
        setOpenDialogCreate(true);
        setScrollDialog(scrollType);
    };



    React.useEffect(() => {

        axios.get(urlApi + urlReseña)
            .then((response) => {
                //const usersFilter = response.data.filter((val) => { if (val.admin === false && val.lineaId === null && !val.internos[0]) return val })
                setReseñas(response.data);
            })

        axios.get(urlApi + urlUser)
            .then((response) => {
                //const usersFilter = response.data.filter((val) => { if (val.admin === false && val.lineaId === null && !val.internos[0]) return val })
                setUsers(response.data.filter((val) => { if (val.admin === false) return val }))
                //.map((e)=>{return e.user}));

            })

        /*axios.get(urlApi + urlLinea + urlUser + '/' + sesion.lineaId)
          .then((response) => { setTrabajos(response.data.users); });*/

        if (openDialogCreate || openDialogEdit || openDialogDelete) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) { descriptionElement.focus(); }
        }
    }, [openDialogCreate, openDialogDelete, openDialogEdit]);



    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    const columnsLinea = [
        { field: 'id', headerName: 'ID', width: 50 },
        {
            field: 'title',
            headerName: 'Título',
            description: 'Interno asignado para el viaje.',
            width: 100,
            valueGetter: (dat) => dat.row.interno.name
        },
        {
            field: 'description',
            headerName: 'Descripción',
            description: 'Conductor asignado para el viaje.',
            width: 250,
            valueGetter: (dat) => dat.row.user.name + " " + dat.row.user.lastname
            //type: 'boolean',
        },
        {
            field: 'reference',
            headerName: 'Linea',
            description: 'Conductor asignado para el viaje.',
            width: 250,
            valueGetter: (dat) => dat.row.reference.name
            //type: 'boolean',
        },
        {
            field: 'createAt',
            headerName: 'Creado',
            description: 'Fecha de creación del viaje.',
            width: 200,
            valueGetter: (rut) => moment(rut.row.createdAt).format("DD/MM/YYYY hh:mm A")
        },
        {
            field: 'updateAt',
            headerName: 'Editado',
            description: 'Última fecha de edición del viaje.',
            width: 200,
            valueGetter: (rut) => moment(rut.row.updatedAt).format("DD/MM/YYYY hh:mm A")
        },
        {
            field: "action",
            headerName: "Opciones",
            description: 'Opciones para interactuar con los datos del viaje.',
            sortable: false,
            width: 150,
            renderCell: (params) => {
                return <Box>
                    <IconButton onClick={(e) => { setReseña(params.row); setOpenDialogEdit(true); setScrollDialog('paper'); }}>
                        <EditRounded />
                    </IconButton>
                    <IconButton onClick={(e) => { setReseña(params.row); setOpenDialogDelete(true); setScrollDialog('paper'); }}>
                        <Delete />
                    </IconButton>
                </Box>;
            }
        },
    ];

    const columnsInterno = [
        { field: 'id', headerName: 'ID', width: 50 },
        {
            field: 'title',
            headerName: 'Título',
            description: 'Interno asignado para el viaje.',
            width: 100,
            valueGetter: (dat) => dat.row.interno.name
        },
        {
            field: 'description',
            headerName: 'Descripción',
            description: 'Conductor asignado para el viaje.',
            width: 250,
            valueGetter: (dat) => dat.row.user.name + " " + dat.row.user.lastname
            //type: 'boolean',
        },
        {
            field: 'createAt',
            headerName: 'Creado',
            description: 'Fecha de creación del viaje.',
            width: 200,
            valueGetter: (rut) => moment(rut.row.createdAt).format("DD/MM/YYYY hh:mm A")
        },
        {
            field: 'updateAt',
            headerName: 'Editado',
            description: 'Última fecha de edición del viaje.',
            width: 200,
            valueGetter: (rut) => moment(rut.row.updatedAt).format("DD/MM/YYYY hh:mm A")
        },
        {
            field: "action",
            headerName: "Opciones",
            description: 'Opciones para interactuar con los datos del viaje.',
            sortable: false,
            width: 150,
            renderCell: (params) => {
                return <Box>
                    <IconButton onClick={(e) => { setReseña(params.row); setOpenDialogEdit(true); setScrollDialog('paper'); }}>
                        <EditRounded />
                    </IconButton>
                    <IconButton onClick={(e) => { setReseña(params.row); setOpenDialogDelete(true); setScrollDialog('paper'); }}>
                        <Delete />
                    </IconButton>
                </Box>;
            }
        },
    ];

    const columnsUser = [
        { field: 'id', headerName: 'ID', width: 50 },
        {
            field: 'title',
            headerName: 'Título',
            description: 'Interno asignado para el viaje.',
            width: 100,
            valueGetter: (dat) => dat.row.interno.name
        },
        {
            field: 'description',
            headerName: 'Descripción',
            description: 'Conductor asignado para el viaje.',
            width: 250,
            valueGetter: (dat) => dat.row.user.name + " " + dat.row.user.lastname
            //type: 'boolean',
        },
        {
            field: 'createAt',
            headerName: 'Creado',
            description: 'Fecha de creación del viaje.',
            width: 200,
            valueGetter: (rut) => moment(rut.row.createdAt).format("DD/MM/YYYY hh:mm A")
        },
        {
            field: 'updateAt',
            headerName: 'Editado',
            description: 'Última fecha de edición del viaje.',
            width: 200,
            valueGetter: (rut) => moment(rut.row.updatedAt).format("DD/MM/YYYY hh:mm A")
        },
        {
            field: "action",
            headerName: "Opciones",
            description: 'Opciones para interactuar con los datos del viaje.',
            sortable: false,
            width: 150,
            renderCell: (params) => {
                return <Box>
                    <IconButton onClick={(e) => { setReseña(params.row); setOpenDialogEdit(true); setScrollDialog('paper'); }}>
                        <EditRounded />
                    </IconButton>
                    <IconButton onClick={(e) => { setReseña(params.row); setOpenDialogDelete(true); setScrollDialog('paper'); }}>
                        <Delete />
                    </IconButton>
                </Box>;
            }
        },
    ];


    return (
        <MiniDrawer
            Contend={
                <Box>
                    <MyBannerPng
                        OpenDialogCreate={handleClickOpenDialogCreate}
                        MyPng={reseñaPng}
                        MyTitle={"Reseñas"}
                        MyDescription={"Administre las reseñas de la Linea"}
                        MyBuutonText={"Crear Nueva Reseña"}
                    />
                    <Divider />
                    <TabContext value={value} >
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange} centered >
                                <Tab label="Linea" value="1" sx={{ flex: 1, fontSize: 12 }} />
                                <Tab label="Interno" value="2" sx={{ flex: 1, fontSize: 12 }} />
                                <Tab label="Conductor" value="3" sx={{ flex: 1, fontSize: 12 }} />
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                            <Box sx={{ height: "79vh", width: '100%' }}>
                                <DataGrid
                                    rows={reseña}
                                    columns={columnsLinea}
                                />
                            </Box>
                        </TabPanel>
                        <TabPanel value="2">
                            <Box sx={{ height: "79vh", width: '100%' }}>
                                <DataGrid
                                    rows={reseña}
                                    columns={columnsInterno}
                                />
                            </Box>
                        </TabPanel>
                        <TabPanel value="3"><Box sx={{ height: "79vh", width: '100%' }}>
                            <DataGrid
                                rows={reseña}
                                columns={columnsUser}
                            />
                        </Box>
                        </TabPanel>
                    </TabContext>

                </Box>
            } />

    )
}

export default ReseñaScreen