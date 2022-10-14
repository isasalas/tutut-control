import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LineaScreen from '../screens/LineaScreen'
import RutasScreen from '../screens/RutasScreen'
import HomeScreen from '../screens/HomeScreen'
import UsuariosScreen from '../trash/UsuariosScreen'
import InternoScreen from '../screens/InternoScreen'
import VueltaScreen from '../screens/VueltaScreen'
import PasajeroScreen from '../trash/PasajeroScreen'
import SocioScreen from '../screens/users/SocioScreen'
import ConductorScreen from '../screens/users/ConductorScreen'
import { ControlScreen } from '../screens/ControlScreen'
import SystemScreen from '../screens/users/SystemScreen'
import LoginScreen from '../screens/LoginScreen'

import {PrivateRoutes} from '../utils/PrivateRoutes'
import DashboardScreen from '../screens/DashboardScreen'
import { SesionContext } from '../providers/SesionProvider'
import { LineaContext } from '../providers/LineaProvider'
import PerfilLineaScreen from '../screens/PerfilLineaScreen'
import UserScreen from '../screens/UserScreen'








export const MyRoutes = () => {

  const {  setSesion } = React.useContext(SesionContext)
  const {  setLinea } = React.useContext(LineaContext)

  React.useEffect(()=>{
    window.addEventListener('storage', ()=>{
      const loginSesion = window.localStorage.getItem('sesion');
        if (!loginSesion) {
            setSesion();
            setLinea();
        }
        else{
          setSesion(JSON.parse(loginSesion))
        }
    })

  },[])


  return (
    <Routes>
      <Route element={<PrivateRoutes/>}>
        <Route path="/ruta" element={<RutasScreen />} />
        <Route path="/linea" element={<LineaScreen />} />
        <Route path="/interno" element={<InternoScreen />} />
        <Route path="/vuelta" element={<VueltaScreen />} />
        <Route path="/socio" element={<SocioScreen />} />
        <Route path="/conductor" element={<ConductorScreen />} />
        <Route path="/control" element={<ControlScreen />} />
        <Route path="/system" element={<SystemScreen />} />
        <Route path="/dashboard" element={<DashboardScreen />} />
        <Route path="/perfillinea" element={<PerfilLineaScreen />} />
        <Route path="/user" element={<UserScreen />} />


        <Route path="/*"/>

      </Route>

      <Route path="/login" element={<LoginScreen />} />


      {
        /*
        <Route path="/" element={<HomeScreen />} />
        <Route path="/usuarios" element={<UsuariosScreen />} />
        <Route path="/pasajeros" element={<PasajeroScreen />} />
         */
      }



    </Routes>
  )
}




