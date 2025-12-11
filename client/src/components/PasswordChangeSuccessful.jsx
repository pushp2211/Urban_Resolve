import React from 'react'
import { Box } from '@mui/material'
import VerifiedIcon from '@mui/icons-material/Verified';
function PasswordChangeSuccessful() {
  return (
    <Box
        sx={{
            minHeight:"100dvh",
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            flexDirection:"column",

        }}
    >
        <VerifiedIcon fontSize='3rem'/>


    </Box>
  )
}

export default PasswordChangeSuccessful