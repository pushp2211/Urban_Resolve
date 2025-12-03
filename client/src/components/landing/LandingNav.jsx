import React from 'react'
import { Box, Avatar, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import {AppBar} from '@mui/material'
import ThemeButton from '../ThemeButton'
function LandingNav({scrollControl, refs}) {
    const navigate = useNavigate();

    const handleautbuttonClick = ()=>{
        navigate("/login");
    }
  return (
    <AppBar
        position='fixed'
        
        sx={{
            bgcolor: 'transparent', // Use transparent for the glass effect
            backdropFilter: 'blur(24px)',
            borderRadius:"3rem",
            display:'flex',
            flexDirection:'row',
            justifyContent:'space-between',
            left: 0,
            right: 0,
            marginLeft: 'auto',
            marginRight: 'auto',
            width:'85%',
            maxWidth:"lg",
            paddingX:"2rem",
            paddingY:"0.6rem",
            top:16,
            zIndex:"10",
        }}
    >
        <Box>
            <Avatar alt="Cindy Baker" src="../public/Logo.svg" 
                sx={{
                    bgcolor:"whitesmoke"
                }}
            />
        </Box>
        <Box
            sx={{
                
                gap:{
                    sm:"2rem",
                },
                display:{
                    sm:"flex",
                    xs:"none"
                },
                flexDirection:"row",
                
            }}
        >
            <Button variant='outlined'
                sx={{
                    // color:"black"
                    borderRadius:"2rem",
                    paddingX:"2.5rem",
                }}
                onClick={()=>scrollControl(refs.home)}
            >
                Home
            </Button>

            <Button variant='outlined'
                sx={{
                    // color:"black",
                    borderRadius:"2rem",
                    paddingX:"2.5rem",
                }}
                onClick={()=>scrollControl(refs.stats)}
            >
                Stats
            </Button>
        </Box>
        <Box
            sx={{
                display:"flex",
                flexDirection:"row",
                gap:1
            }}
        >
            <ThemeButton/>
            <Button variant='outlined'
                sx={{
                    // color:"black"
                    borderRadius:"2rem",
                }}
                onClick={()=>{handleautbuttonClick()}}
            >
                Onboard
            </Button>
        </Box>
    </AppBar>
  )
}

export default LandingNav