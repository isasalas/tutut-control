import React from 'react'
import MyUserScreen from '../../components/myUserScreen'
import { MySvgDriver } from '../../assets/mySvg'
import MiniDrawer from '../../components/mydrawer'

const ConductorScreen = () => {
  return (
    <MiniDrawer Contend={
      <MyUserScreen
        ButtonCreateLabel='Crear Conductor'
        Description='Aqui podras administrar los datos de los Conductores del sistema'
        DialogCreateDescription='Pon todos los datos'
        DialogCreateTitle='Crear Conductor del sistema'
        DialogDeleteDescription='Seguro que quieres eliminar este usuario?'
        DialogDeleteTitle='Eliminar Conductor del sistema'
        DialogEditDescription='Edita los campos que quieras'
        DialogEditTitle='Editar Conductor del sistema'
        Role='4'
        TitlePlural='Conductores'
        TitleSingular='Conductor'
        MySvg={<MySvgDriver />}
      ></MyUserScreen>
    }>

    </MiniDrawer>
  )
}

export default ConductorScreen