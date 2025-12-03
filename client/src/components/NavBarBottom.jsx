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
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import LogoutIcon from '@mui/icons-material/Logout';
import { ROLES } from '../../enum/roles';
import CustomMenu from './CustomMenu';
import { useThemeToggle } from '../context/ThemeContext';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useLoading } from '../context/LoadingContext';
// Update pages to be an array of objects with paths

const userPages = [
  { label: 'Home', path: '/dashboard' },
  { label: 'My Complaints', path: '/my-complaints' },
];
const staffPages = [
  { label: 'Home', path: '/dashboard' },
  { label: 'My Complaints', path: '/my-complaints' },
  { label: 'Assigned Complaints', path: '/assigned-complaints' },
];

const adminPages = [
  { label: 'Home', path: '/dashboard' },
  { label: 'My Complaints', path: '/my-complaints' },
  { label: 'Manage', path: '/management' },
];

function NavBarBottom() {
  const {showLoading, hideLoading} = useLoading();
  const { user, logout } = useAuth();
  const {mode, toggleTheme} = useThemeToggle();
  const navigate = useNavigate();
  // console.log(user);
  useEffect(() => {
    if (user.role === ROLES.ADMIN) {
      setPages(adminPages);
    }
    if (user.role === ROLES.STAFF) {
      setPages(staffPages);
    }
  }, [user]);

  const [pages, setPages] = React.useState(userPages);

  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleThemeClick = ()=>{
    toggleTheme();
  }



  const handleLogout = async (event) => {
    showLoading();
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.post('/logout');

      if (response.status === 200) {
        logout();
        navigate('/login');
      }
    } catch (error) {
      alert('Encountered an error while log out, Please try again.');
      setError(
        error.response?.data?.message || 'failed logging out please try again'
      );
      console.error('logout error', error);
    } finally {
      hideLoading();
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        // backgroundColor:'red',
        zIndex: 2,
        boxShadow: 0,
        bgcolor: 'transparent', // Use transparent for the glass effect
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.2)', // Complete border style
        mt: 2,
        display: { xs: 'fixed', md: 'none' },
        marginBottom: '0.5rem',
        borderRadius: '1rem',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            minHeight: '4rem', // <-- adjust height here (default 64)
          }}
        >

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            {pages.map((page) => (
              <Button
                key={page.label}
                component={routerLink} // Make buttons act as router links
                to={page.path}
                sx={{
                  my: 0,
                  color: 'text.primary',
                  display: 'block',
                  marginX: '0rem',
                  textAlign: 'center',
                  fontSize: {
                    xs: '0.7rem',
                    md: '1rem',
                    lg: '',
                  },
                }}
              >
                {page.label}
              </Button>
            ))}
            {/*<Button
              sx={{ color: 'text.primary', marginX: '0rem' }}
               onClick={()=>menuToggle} // <-- Add logout functionality
            >
               <LogoutIcon /> 
              
              <MenuIcon/>
            </Button>*/} 
            <CustomMenu
              buttonLabel='Menu'
              
              items={[
                {
                  label: mode==="dark"? "Light Mode" : "Dark Mode",
                  icon: mode === "dark"?<LightModeIcon/> : <DarkModeIcon/> ,
                  onClick: handleThemeClick
                },
                {
                  label: "Logout",
                  icon: <LogoutIcon/>,
                  onClick: handleLogout
                },
                // {
                //   item:<Button>
                //     <LogoutIcon/>
                //     Log Out
                //   </Button>
                // }
                // <ThemeButton/>
              ]}
            />
            
            <Tooltip title="Profile">
              <IconButton
                key="profile"
                component={routerLink}
                to="/profile"
                sx={{ p: 0 }}
              >
                <Avatar alt={user.fullName} src={user.profilePicture} />
              </IconButton>
            </Tooltip>
          </Box>
          {/* <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}> */}

          {/* You will need to add the <Menu> component here for the settings dropdown */}
          {/* </Box> */}
        </Toolbar>
      </Container>
    </Box>
  );
}

export default NavBarBottom;
