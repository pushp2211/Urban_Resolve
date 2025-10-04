import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'


function Dashboard() {
  return (
    <Box>
        <Typography
            variant='h2'
            sx={{
              fontWeight:"bold"
            }}
        >
            Blog
        </Typography>
        <Typography 
          sx={{
            marginY:'1rem'
          }}
        >
          Stay updated with problems and developments in your city.
        </Typography>
          
    </Box>
  )
}

export default Dashboard