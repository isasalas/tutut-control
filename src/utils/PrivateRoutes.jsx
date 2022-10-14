import React, { useContext } from 'react'
import {Outlet,Navigate} from 'react-router-dom'
import { SesionContext } from '../providers/SesionProvider'

export const PrivateRoutes = () => {
 
    
    const {sesion} =useContext(SesionContext)
    //const sesionLogin= window.localStorage.getItem('sesion');

    //let auth = {'token':false}
    /*React.useEffect(()=>{

    },[sesion])*/
  return (
    sesion ? <Outlet/> : <Navigate to="/login"/>
  )
}

//export default PrivateRoutes