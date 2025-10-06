import React from 'react'
import NavBar from '../components/NavBar'
import Toolbar from '@mui/material/Toolbar'
import { Outlet } from 'react-router-dom'
import Box from '@mui/material/Box'
import NavBarBottom from '../components/NavBarBottom'
import Container from '@mui/material/Container'
function Layout() {
  return (
    <Box
        
    >
      <NavBar />
      <Toolbar /> {/* <-- ADD THIS SPACER */}
        <Container
            sx={{
                marginTop:'3rem'
            }}
        >
            <main className="content-area">
            <Outlet />
            </main>
        </Container>
        <Toolbar />
        <NavBarBottom/>
    </Box>
  )
}

export default Layout