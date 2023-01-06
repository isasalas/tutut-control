import * as React from 'react';
import PropTypes from 'prop-types';

import {
    styled,
    useTheme
} from '@mui/material/styles';
import {
    Box,
    Drawer as MuiDrawer,
    AppBar as MuiAppBar,
    Toolbar,
    List,
    CssBaseline,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import {
    Menu as MenuIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    VillaRounded as VillaRoundedIcon,
    ForkRightRounded as ForkRightRoundedIcon,
    DirectionsBusRounded as DirectionsBusRoundedIcon,
    Forward5Rounded as Forward5RoundedIcon,
    AdminPanelSettingsRounded as AdminPanelSettingsRoundedIcon,
    ExitToAppRounded,
    SixtyFpsRounded,
    SupervisedUserCircleRounded,
    ControlPointDuplicateRounded,
    EditOffRounded,
    ChangeCircleRounded,
    AccountCircle,
    Preview,
    RateReview
} from '@mui/icons-material';

import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { SesionContext } from '../providers/SesionProvider';
import axios from 'axios';
import { urlApi, urlLinea } from '../api/myApiData';


const itemsList = [
    {
        text: "Viajes",
        icon: <Forward5RoundedIcon />,
        route: "/viaje"
    },
    {
        text: "Rutas",
        icon: <ForkRightRoundedIcon />,
        route: "/ruta"
    },
    {
        text: "Internos",
        icon: <SixtyFpsRounded />,
        route: "/interno"
    },
    {
        text: "Perfil de Linea",
        icon: <DirectionsBusRoundedIcon />,
        route: "/perfillinea"
    },
    /*{
        text: "Reseñas",
        icon: <RateReview />,
        route: "/reseña"
    }*/
];

const userItemsList = [
    {
        text: "Lineas",
        icon: <VillaRoundedIcon />,
        route: "/linea"
    },
    {
        text: "Administradores",
        icon: <AdminPanelSettingsRoundedIcon />,
        route: "/admin"
    },
    {
        text: "Controles",
        icon: <Preview />,
        route: "/control"
    },

    {
        text: "Usuarios",
        icon: <SupervisedUserCircleRounded />,
        route: "/user"
    }
];


const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

const MiniDrawer = (props) => {
    const Contend = props.Contend;
    const { setSesion, sesion } = React.useContext(SesionContext)
    const [Linea, setLinea] = React.useState();


    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const navigater = useNavigate();


    React.useEffect(() => {
        if (!sesion.linea) navigater("/trabajo", { replace: true });
        setLinea(sesion.linea)
        /*axios.get(urlApi + urlLinea + "/" + sesion.linea.id)
            .then((response) => { setLinea(response.data); })*/
    }, [])

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(open && { display: 'none' }),
                        }}
                    > <MenuIcon /> </IconButton>
                    <Typography variant="h6" noWrap component="div">  {!Linea ? "..." : Linea.name} </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <IconButton onClick={() => {
                        const data = sesion;
                        data.linea = null;
                        window.localStorage.setItem('sesion', JSON.stringify(data))
                        setSesion({ ...sesion, linea: null });
                    }} title={"Cambiar linea de trabajo"} component={RouterLink} to="/trabajo" > <ChangeCircleRounded /> </IconButton>
                    <IconButton  title={"Editar perfil"} component={RouterLink} to="/perfil" > <AccountCircle /> </IconButton>
                    <IconButton onClick={() => {
                        window.localStorage.removeItem('sesion');
                        setSesion();
                    }}  title={"Cerrar Sesión"} component={RouterLink} to="/login" > <ExitToAppRounded /> </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>

                    {itemsList.map((item) => (
                        <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                            <ListItemButton component={RouterLink} to={item.route}
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider />
                {sesion.admin === true ? (
                    <div>
                        <List>
                            {
                                userItemsList.map((item) => (
                                    <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                                        <ListItemButton component={RouterLink} to={item.route}
                                            sx={{
                                                minHeight: 48,
                                                justifyContent: open ? 'initial' : 'center',
                                                px: 2.5,
                                            }}
                                        >
                                            <ListItemIcon
                                                sx={{
                                                    minWidth: 0,
                                                    mr: open ? 3 : 'auto',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                {item.icon}
                                            </ListItemIcon>
                                            <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
                                        </ListItemButton>
                                    </ListItem>
                                ))

                            }

                        </List>

                        <Divider /></div>) : (<div />)}
                {/*<List>

                    <ListItem disablePadding sx={{ display: 'block' }}>
                        <ListItemButton onClick={() => {
                            const data = sesion;
                            data.linea = null;
                            window.localStorage.setItem('sesion', JSON.stringify(data))
                            setSesion({ ...sesion, linea: null });
                        }} component={RouterLink} to="/trabajo"
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <ChangeCircleRounded />
                            </ListItemIcon>
                            <ListItemText primary="Cambiar Linea" sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding sx={{ display: 'block' }}>
                        <ListItemButton component={RouterLink} to="/perfil"
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <AccountCircle />
                            </ListItemIcon>
                            <ListItemText primary={"Perfil"} sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding sx={{ display: 'block' }}>

                        <ListItemButton onClick={() => {
                            window.localStorage.removeItem('sesion');
                            setSesion();
                        }} component={RouterLink} to="/login"
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <ExitToAppRounded />
                            </ListItemIcon>
                            <ListItemText primary="Cerrar Sesion" sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>

                </List>*/}
            </Drawer>
            <Box sx={{ flexGrow: 1, p: 1.5 }} >
                <DrawerHeader />
                {Contend}
            </Box>
        </Box>
    );
};
MiniDrawer.propTypes = {
    Contend: PropTypes.object.isRequired,
};
export default MiniDrawer
