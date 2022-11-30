import React, { useContext } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import LineaScreen from '../screens/LineaScreen'
import RutasScreen from '../screens/RutasScreen'
import InternoScreen from '../screens/InternoScreen'
import ViajeScreen from '../screens/ViajeScreen'
import { ControlScreen } from '../screens/ControlScreen'
import AdminScreen from '../screens/AdminScreen'
import LoginScreen from '../screens/LoginScreen'
import PerfilLineaScreen from '../screens/PerfilLineaScreen'
import UserScreen from '../screens/UserScreen'
//import {PrivateRoutes} from '../utils/PrivateRoutes'
import DashboardScreen from '../screens/DashboardScreen'
import { SesionContext } from '../providers/SesionProvider'


const PrivateRoutes = () => {
  const {sesion} =useContext(SesionContext)
return (
  sesion ? <Outlet/> : <Navigate to="/login"/>
)
}

export const MyRoutes = () => {

  const {  setSesion } = React.useContext(SesionContext)

  React.useEffect(()=>{
    window.addEventListener('storage', ()=>{
      const loginSesion = window.localStorage.getItem('sesion');
        if (!loginSesion) {
            setSesion();
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
        <Route path="/vuelta" element={<ViajeScreen />} />
        <Route path="/control" element={<ControlScreen />} />
        <Route path="/admin" element={<AdminScreen />} />
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




