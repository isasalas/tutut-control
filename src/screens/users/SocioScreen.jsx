import React from 'react'
import MyUserScreen from '../../components/myUserScreen'
import { MySvgKeyCar } from '../../assets/mySvg'
import MiniDrawer from '../../components/mydrawer'

const SocioScreen = () => {
  return (
    <MiniDrawer Contend={
      <MyUserScreen
        ButtonCreateLabel='Crear Socio'
        Description='Aqui podras administrar los datos de los Socios del sistema'
        DialogCreateDescription='Pon todos los datos'
        DialogCreateTitle='Crear Socio del sistema'
        DialogDeleteDescription='Seguro que quieres eliminar este usuario?'
        DialogDeleteTitle='Eliminar Socio del sistema'
        DialogEditDescription='Edita los campos que quieras'
        DialogEditTitle='Editar Socio del sistema'
        Role='3'
        TitlePlural='Socios'
        TitleSingular='Socio'
        MySvg={<MySvgKeyCar />}
      ></MyUserScreen>
    }></MiniDrawer>

  )
}

export default SocioScreen