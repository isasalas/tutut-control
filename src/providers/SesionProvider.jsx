import React, { createContext } from 'react'
import { LineaModelJson, UserModelJson } from '../models/models';

export const SesionContext= createContext();

export const SesionProvider = ({children}) => {
    const [sesion, setSesion] = React.useState();

  return (
    <SesionContext.Provider value={{sesion,setSesion}}>
        {children}
    </SesionContext.Provider>
  )
}

