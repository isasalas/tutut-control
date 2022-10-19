import React, { useEffect } from "react";

import MiniDrawer from "./components/mydrawer";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { Box } from "@mui/material";
import { SnackbarProvider, useSnackbar } from 'notistack';
import { SesionProvider } from "./providers/SesionProvider";

import { BrowserRouter } from "react-router-dom";
import { MyRoutes } from "./components/myRoutes";
import { LoadScript } from "@react-google-maps/api";


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const App = () => {



  return (
    <LoadScript googleMapsApiKey="AIzaSyBJ7gTWLlIZE3GqIuwwRV1FJnvx2AceHLM" >

      <SesionProvider>
          <SnackbarProvider maxSnack={3}>
            <ThemeProvider theme={darkTheme}>
              <CssBaseline />
              <BrowserRouter>
                <MyRoutes />
              </BrowserRouter>
            </ThemeProvider>
          </SnackbarProvider>
      </SesionProvider>
    </LoadScript>

  )
}

export default App














