import React from 'react'
import NavBar from '../components/NavBar'
import Toolbar from '@mui/material/Toolbar'
import { Outlet } from 'react-router-dom'
import Box from '@mui/material/Box'
import NavBarBottom from '../components/NavBarBottom'
import Container from '@mui/material/Container'
import FabRegisterComplaint from '../components/FabRegisterComplaint'
import FilterBar from '../components/FilterBar';
function Layout() {
  
  return (
    <Box
        sx={{
          width:"100vw"
        }}
    >
      <NavBar />
      {/* <FilterBar/> */}
      <Toolbar /> 
        <Box
            sx={{
                marginTop:'3rem',
                width:"100%",
            }}
        >
            <main className="content-area">
            <Outlet />
            </main>
        </Box>
        <Toolbar />
        <NavBarBottom/>
        <FabRegisterComplaint/>
    </Box>
  )
}

export default Layout