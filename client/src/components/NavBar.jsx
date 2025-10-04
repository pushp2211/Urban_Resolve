import * as React from 'react';
import { Link as routerLink, useNavigate } from 'react-router-dom';

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

// Update pages to be an array of objects with paths
const pages = [
  { label: 'Home', path: '/' },
  { label: 'Highlights', path: '/highlights' },
  { label: 'My Complaints', path: '/my-complaints' }
];
const settings = ['Profile', 'Logout'];

function NavBar() {
  const { logout } = useAuth(); // <-- Get logout function from context
  const navigate = useNavigate();
  


  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const handleLogout = async(event) => {
    event.preventDefault();
    
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/logout');

      if(response.status === 200){
        logout();
        navigate('/login');
      }
    } catch (error) {
        alert("Encountered an error while log out, Please try again.")
        setError(error.response?.data?.message || "failed logging out please try again")
        console.error("logout error", error);
    }
    finally{
      setLoading(false);
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
        boxShadow: 0,
        bgcolor: 'transparent', // Use transparent for the glass effect
        backdropFilter: 'blur(24px)',
        borderRadius: '1rem',
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
            to='/'
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
            LOGO
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
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
            <Button
                sx={{ color: 'text.primary', marginX:'2rem' }}
                onClick={handleLogout} // <-- Add logout functionality
            >
                Log Out
            </Button>
            <Tooltip title="Open settings">
              <IconButton 

              key='profile'
              component={routerLink}
              to='/profile'
              sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
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