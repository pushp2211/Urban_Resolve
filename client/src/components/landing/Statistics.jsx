import React from 'react'

import { Box } from '@mui/material'
import UserStats from './UserStats'
import ComplaintStats from './ComplaintStats'
function Statistics() {
    
  return (
    <Box
        sx={{
            marginY:"5rem",
            display:"flex",
            flexDirection:"column",
            gap:"10svh"
        }}
    >
        <UserStats/>
        <ComplaintStats/>
    </Box>
  )
}

export default Statistics