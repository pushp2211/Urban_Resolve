import { Box } from '@mui/material'
import React from 'react'
import HorizontalChart from './HorizontalChart';

function UserStats() {

    const userData = [
      { role: 'Active Users', count: 120 },
      { role: 'Staff', count: 25 },
      { role: 'Admins', count: 5 },
    ];

  return (
    <Box
        sx={{
            display:"flex",
            gap:2,
            flexDirection:{
                xs:"column",
                sm:"row",
                lg:"row"
            },
            justifyContent:"center",
            alignItems:"center",
            // flexGrow:1,
        }}
    >
        <Box
            sx={{
                width:{
                    xs:"100%",
                    md:"50%",
                },
                justifySelf:"center"
            }}
        >
            <HorizontalChart data={userData}/>
        </Box>
        <Box 
            sx={{
                textAlign:"center",
                paddingX:{
                    lg:"5rem",
                    md:"3rem",
                    sm:"1rem",
                    xs:"0.3rem"
                },
                fontSize:"1.2rem"
            }}
        >
            Many of our citizens are helping to create a cleaner, safer, and smarter city. Register today to report problems,
            track solutions, and contribute directly to meaningful urban change.
        </Box>
    </Box>
  )
}

export default UserStats