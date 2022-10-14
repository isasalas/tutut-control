import { Grid } from '@mui/material'
import React from 'react'
import { MySvgMinibus } from '../assets/mySvg'
import MiniDrawer from '../components/mydrawer'

const HomeScreen = () => {
  return (
    <MiniDrawer Contend={
      <div>
        <Grid >
          <MySvgMinibus colorbg='ffffff' colorpr='ffffff'></MySvgMinibus>
        </Grid>  </div>
    }></MiniDrawer>


  )
}

export default HomeScreen