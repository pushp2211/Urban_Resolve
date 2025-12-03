import React from 'react'
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { Box, Typography } from '@mui/material';
import {IconButton} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useThemeToggle } from '../context/ThemeContext';
function ThemeButton({label=false}) {
    const theme = useTheme();
    const {toggleTheme} = useThemeToggle();

    const changeTheme = ()=>{
        toggleTheme();
    }
  return (
    <Box
        sx={{
            display:"flex",
            flexDirection:"row",
            gap:1
        }}
    >
        {theme.palette.mode === "dark" && <IconButton
            onClick={()=>changeTheme()}

        >
            <LightModeIcon/>
            {label && 
                <Typography> Light Mode </Typography>
            }
        </IconButton>}
        {theme.palette.mode === "light" && <IconButton
            onClick={()=>changeTheme()}
        >
            <DarkModeIcon/>
            {label && 
                <Typography> Dark Mode </Typography>
            }
        </IconButton>}
    </Box>
  )
}

export default ThemeButton