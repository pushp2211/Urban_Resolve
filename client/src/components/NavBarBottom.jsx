import * as React from 'react';
import { Link as routerLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';
import { toggleTheme } from '../redux/slices/themeSlice';
import { showLoading, hideLoading } from '../redux/slices/loadingSlice';
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
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const mode = useSelector((state) => state.theme?.mode || 'light');

  const [pages, setPages] = React.useState(userPages);
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (user?.role === ROLES.ADMIN) {
      setPages(adminPages);
    } else if (user?.role === ROLES.STAFF) {
      setPages(staffPages);
    } else {
      setPages(userPages);
    }
  }, [user]);

  const handleThemeClick = () => {
    dispatch(toggleTheme());
  };

  const handleLogout = async (event) => {
    dispatch(showLoading());
    setLoading(true);
    setError('');
    try {
      await dispatch(logoutUser());
      navigate('/login');
    } catch (err) {
      alert('Encountered an error while log out, Please try again.');
      setError(err?.message || 'failed logging out please try again');
      console.error('logout error', err);
    } finally {
      dispatch(hideLoading());
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        zIndex: 2,
        boxShadow: 0,
        bgcolor: 'transparent',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
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
            minHeight: '4rem',
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
                component={routerLink}
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

            <CustomMenu
              buttonLabel="Menu"
              items={[
                {
                  label: mode === 'dark' ? 'Light Mode' : 'Dark Mode',
                  icon: mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />,
                  onClick: handleThemeClick,
                },
                {
                  label: 'Logout',
                  icon: <LogoutIcon />,
                  onClick: handleLogout,
                },
              ]}
            />

            <Tooltip title="Profile">
              <IconButton
                key="profile"
                component={routerLink}
                to="/profile"
                sx={{ p: 0 }}
              >
                <Avatar alt={user?.fullName} src={user?.profilePicture} />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </Box>
  );
}

export default NavBarBottom;
