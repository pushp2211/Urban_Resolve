import * as React from 'react';
import { Link as routerLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // <-- Import useAuth
import apiClient from '../api/axios';
// MUI Imports
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { ROLES } from '../../enum/roles';
import ThemeButton from './ThemeButton';
import { useLoading } from '../context/LoadingContext';
// Update pages to be an array of objects with paths
const userPages = [
  { label: 'Home', path: '/dashboard' },
  { label: 'My Complaints', path: '/my-complaints' }
];
const staffPages = [
  { label: 'Home', path: '/dashboard' },
  { label: 'My Complaints', path: '/my-complaints' },
  { label: 'Assigned Complaints', path: '/assigned-complaints' }
]

const adminPages = [
  { label: 'Home', path: '/dashboard' },
  { label: 'My Complaints', path: '/my-complaints' },
  { label: 'Manage', path: '/management' }
]

function NavBar() {
  const {user, logout } = useAuth();
  const {showLoading, hideLoading} = useLoading();

  const navigate = useNavigate();
  // console.log(user);
  useEffect(()=>{
    if(user.role === ROLES.ADMIN){
    setPages(adminPages);
    }
    if(user.role === ROLES.STAFF){
    setPages(staffPages);
    }
  }, [user])

  const [pages, setPages] = React.useState(userPages);
  

  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const handleLogout = async(event) => {
    event.preventDefault();
    showLoading();
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/logout');
      localStorage.removeItem('accessToken')

      if(response.status === 200){
        logout();
        navigate('/urban-resolve');
      }
    } catch (error) {
        alert("Encountered an error while log out, Please try again.")
        setError(error.response?.data?.message || "failed logging out please try again")
        console.error("logout error", error);
    }
    finally{
      setLoading(false);
      hideLoading();
    }
  };
  const openProfile = ()=>{
    
  }

  return (
    <AppBar
      position="fixed"
      sx={{

        width: '95%',
        maxWidth: "lg",
        // Add left and right for proper centering of fixed elements
        left: 0,
        right: 0,
        marginLeft: 'auto',
        marginRight: 'auto',
        // --- Your Glass Effect Styles ---
        boxShadow: 1,
        bgcolor: 'transparent', // Use transparent for the glass effect
        backdropFilter: 'blur(24px)',
        borderRadius: '1.5rem',
        border: '1px solid rgba(255, 255, 255, 0.2)', // Complete border style
        mt: 2,
        display: {xs:'none',  md:'fixed'}
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters
            sx={{
                minHeight: 30,              // <-- adjust height here (default 64)
            }}
        >

          <Typography
          
            variant="h6"
            component={routerLink}
            to='/dashboard'
            sx={{
                
              display: 'flex',
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'text.primary', // Use inherit for theme-aware color
              textDecoration: 'none',
              flexGrow: 1, // Pushes other items to the right
            }}
          >
            Urban resolve
          </Typography>
          
          <Box sx={{ display: 'flex' }}>
            {pages.map((page) => (
              <Button
                key={page.label}
                component={routerLink} // Make buttons act as router links
                to={page.path}
                sx={{ my: 0, color: 'text.primary', display: 'block', marginX:'1.5rem' }}
              >
                {page.label}
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap:1 }}>
            <Button
                sx={{ color: 'text.primary', marginX:'2rem' }}
                onClick={handleLogout} // <-- Add logout functionality
            >
                Log Out
            </Button>
            <ThemeButton/>
            <Tooltip title="Open profile">
              <IconButton 
              key='profile'
              component={routerLink}
              to='/profile'
              sx={{ p: 0 }}>
                <Avatar alt={user.fullName} src={user.profilePicture} />
              </IconButton>
            </Tooltip>
            
            {/* You will need to add the <Menu> component here for the settings dropdown */}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default NavBar;