import * as React from 'react';
import { Link as routerLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';
import { showLoading, hideLoading } from '../redux/slices/loadingSlice';
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

function NavBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

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

  const handleLogout = async (event) => {
    event.preventDefault();
    dispatch(showLoading());
    setLoading(true);
    setError('');

    try {
      await dispatch(logoutUser());
      navigate('/urban-resolve');
    } catch (err) {
      alert('Encountered an error while log out, Please try again.');
      setError(err?.message || 'failed logging out please try again');
      console.error('logout error', err);
    } finally {
      setLoading(false);
      dispatch(hideLoading());
    }
  };

  if (!user) return null;

  return (
    <AppBar
      position="fixed"
      sx={{
        width: '95%',
        maxWidth: 'lg',
        left: 0,
        right: 0,
        marginLeft: 'auto',
        marginRight: 'auto',
        boxShadow: 1,
        bgcolor: 'transparent',
        backdropFilter: 'blur(24px)',
        borderRadius: '1.5rem',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        mt: 2,
        display: { xs: 'none', md: 'fixed' },
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            minHeight: 30,
          }}
        >
          <Typography
            variant="h6"
            component={routerLink}
            to="/dashboard"
            sx={{
              display: 'flex',
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'text.primary',
              textDecoration: 'none',
              flexGrow: 1,
            }}
          >
            Urban resolve
          </Typography>

          <Box sx={{ display: 'flex' }}>
            {pages.map((page) => (
              <Button
                key={page.label}
                component={routerLink}
                to={page.path}
                sx={{ my: 0, color: 'text.primary', display: 'block', marginX: '1.5rem' }}
              >
                {page.label}
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              sx={{ color: 'text.primary', marginX: '2rem' }}
              onClick={handleLogout}
            >
              Log Out
            </Button>
            <ThemeButton />
            <Tooltip title="Open profile">
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
    </AppBar>
  );
}

export default NavBar;
