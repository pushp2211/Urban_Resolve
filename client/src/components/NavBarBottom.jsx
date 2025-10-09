import * as React from 'react';
import { Link as routerLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <-- Import useAuth
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { Tooltip } from '@mui/material';
import {Avatar} from '@mui/material';
import {IconButton} from '@mui/material';
const pages = [
  { label: 'Home', path: '/' },
  { label: 'Highlights', path: '/highlights' },
  { label: 'My Complaints', path: '/my-complaints' },
];

function NavBarBottom() {
    const {user} = useAuth();
  return (
    <Box
        sx={{
            position:'fixed',
            bottom:0,
            width:'100%',
            // backgroundColor:'red',
            zIndex:2,
            boxShadow: 0,
            bgcolor: 'transparent', // Use transparent for the glass effect
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.2)', // Complete border style
            mt: 2,
            display: {xs:'fixed',  md:'none'},
            marginBottom:'0.5rem',
            borderRadius:'1rem',

        }}
    >
        <Container
            sx={{
                display:'flex',
                gap:1.2,
                justifyContent:'space-between',
                alignItems:'center'
            }}
        >
            
            {
                pages.map((page)=>(
                    <Button
                        key={page.label}
                        component={routerLink} // Make buttons act as router links
                        to={page.path}
                        sx={{ my: 0, color: 'text.primary', display: 'block', textAlign:'center', }}
                    >
                        {page.label}
                    </Button>
                ))
            }
            <Tooltip title="Open settings">
              <IconButton 
              key='profile'
              component={routerLink}
              to='/profile'
              sx={{ p: 1 }}>
                <Avatar alt={user.fullName} src={user.profilePicture} />
              </IconButton>
            </Tooltip>
        </Container>


    </Box>
  )
}

export default NavBarBottom