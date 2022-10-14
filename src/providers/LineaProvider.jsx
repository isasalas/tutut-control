import React, { createContext } from 'react'
import { LineaModelJson, UserModelJson } from '../models/models';

export const LineaContext= createContext();

export const LineaProvider = ({children}) => {
    const [linea, setLinea] = React.useState();

  return (
    <LineaContext.Provider value={{linea,setLinea}}>
        {children}
    </LineaContext.Provider>
  )
}

