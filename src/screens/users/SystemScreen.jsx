import React from 'react'
import { MySvgControl, MySvgControlGps, MySvgSystem } from '../../assets/mySvg'
import MiniDrawer from '../../components/mydrawer'
import MyUserScreen from '../../components/myUserScreen'

const SystemScreen = () => {
  return (
    <MiniDrawer Contend={
      <MyUserScreen 
    ButtonCreateLabel='Crear Administrador' 
    Description='Aqui podras administrar los datos de los adminitradores del sistema'
    DialogCreateDescription='Pon todos los datos'
    DialogCreateTitle='Crear Administrador del sistema'
    DialogDeleteDescription='Seguro que quieres eliminar este usuario?'
    DialogDeleteTitle='Eliminar administrador del sistema'
    DialogEditDescription='Edita los campos que quieras'
    DialogEditTitle='Editar administrador del sistema'
    Role='1'
    TitlePlural='Admins'
    TitleSingular='Admin'
    MySvg={<MySvgSystem/>}
    ></MyUserScreen>
    }></MiniDrawer>

    
  )
}

export default SystemScreen