import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LineasScreen from '../screens/LineasScreen'
import RutasScreen from '../screens/RutasScreen'
import HomeScreen from '../screens/HomeScreen'
import UsuariosScreen from '../screens/UsuariosScreen'
import InternosScreen from '../screens/InternosScreen'
import VueltasScreen from '../screens/VueltasScreen'




export const RoutesMyAPP = () => {
  return (
    <Routes>

      <Route path="/rutas" element={<RutasScreen />} />
      <Route path="/" element={<HomeScreen />} />
      <Route path="/lineas" element={<LineasScreen />} />
      <Route path="/usuarios" element={<UsuariosScreen />} />
      <Route path="/internos" element={<InternosScreen />} />
      <Route path="/vueltas" element={<VueltasScreen />} />
    </Routes>
  )
}


