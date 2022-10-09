import React, { useEffect } from "react";

import MiniDrawer from "./components/mydrawer";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { Box } from "@mui/material";
import { SnackbarProvider, useSnackbar } from 'notistack';



const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const App = () => {
  useEffect(() => { }, []);
  return (
    <SnackbarProvider maxSnack={3}>
    <ThemeProvider theme={darkTheme}>

      
        <CssBaseline />
        <MiniDrawer></MiniDrawer>
    </ThemeProvider>
</SnackbarProvider>

  )
}

export default App