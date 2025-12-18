import React, { useState, useEffect } from 'react';
// import {theme} from '../theme';
// import useTheme from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { triggerNotification } from '../../utils/notificationService';
import {
  Modal,
  Box,
  Paper,
  Avatar,
  Typography,
  Menu,
  MenuItem,
  Button,
} from '@mui/material';
import { ROLES, ROLES_ENUM } from '../../enum/roles';
import apiClient from '../api/axios';
import Snack from './Snack';
import { SNACK_SEVERITY } from '../../enum/snackSeverity';
function UserManageModal({ open, handleOnClose, user }) {
  const theme = useTheme();
  // console.log(user);
  const [menuOpen, setMenuOpen] = useState(null);
  const handleMenuOpen = (event) => {
    setMenuOpen(event.currentTarget);
  };

  const [roleSetLoading, setRoleSetLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);
  const [showSnack, setShowSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const [snackSeverity, setSnackSeverity] = useState(SNACK_SEVERITY.INFO);

useEffect(() => {
  setCurrentUser(user);
}, [user]); 

  const handleMenuClose = () => {
    setMenuOpen(null);
  };
  const handleRoleChange = async (newRole) => {
  const curRole = user?.role;
  if (curRole === newRole) {
    console.log("No role change needed — same as current.");
    setSnackMessage('Role is already set to ' + newRole);
    setSnackSeverity(SNACK_SEVERITY.INFO);
    setShowSnack(true);
    handleMenuClose();
    return;
  }

  setRoleSetLoading(true); 
  handleMenuClose();

  try {
    const response = await apiClient.patch(
      `/admin/updateRole/${user?._id}`,
      { role: newRole },
    );

    // console.log(`Role updated successfully to ${newRole}`, response);
    const updatedUser = response.data.data;
    setCurrentUser(updatedUser);
    setSnackMessage('Role updated successfully');
    setSnackSeverity(SNACK_SEVERITY.SUCCESS);
    setShowSnack(true);
    // console.log('Snack state set:', { snackMessage: 'Role updated successfully', showSnack: true });
    
    triggerNotification({
      recipient_id: user._id,
      message: `Your role status has been upgraded to ${newRole}`,
    });
  } catch (error) {
    console.error("Error updating role:", error);
    setSnackMessage(error.response?.data?.message || "Failed to update role");
    setSnackSeverity(SNACK_SEVERITY.ERROR);
    setShowSnack(true);
    // console.log('Snack error state set:', { snackMessage: error.response?.data?.message || "Failed to update role", showSnack: true });
  } finally {
    setRoleSetLoading(false); 
  }
};

  return (
    <Modal
      open={open}
      onClose={handleOnClose}
      sx={{
        backdropFilter: 'blur(2px)',
        backgroundColor: 'rgba(0,0,0,0.3)',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // overflow:"scroll"
      }}
    >
      <Paper
        sx={{
          minWidth: {
            xs: '24rem',
            sm: '24rem',
            md: '40rem',
            lg: '40rem',
          },
          minHeight: {
            xs: '24rem',
            sm: '24rem',
            md: '30rem',
            lg: '25rem',
          },
          display: 'flex',
          flexDirection: {
            xs: 'column',
            sm: 'column',
            md: 'row',
            lg: 'row',
          },
          gap: 1,
          justifyContent: 'center',
          alignItems: 'center',
          //   height:"100%",
          borderRadius: '2rem',
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            // bgcolor:"red",
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Avatar
            alt="Cindy Baker"
            src={currentUser?.profilePicture}
            sx={{
              width: {
                lg: '6rem',
              },
              height: {
                lg: '6rem',
              },
            }}
          />
          <Typography
            sx={{
              backgroundColor:
                theme.palette.mode === 'dark' ? '#3c4042' : '#f1f0fa',
              padding: 1,
              borderRadius: '1rem',
            }}
          >
            ROLE: {currentUser?.role}
          </Typography>
          <Box
            sx={{
              backgroundColor:
                theme.palette.mode === 'dark' ? '#3c4042' : '#f1f0fa',
              padding: 1,
              borderRadius: '1rem',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            Address Details:
            <Typography
              variant="overline"
              sx={{
                fontWeight: 'medium',
              }}
            >
              {currentUser?.address?.locality}, {currentUser?.address?.city},{' '}
              {currentUser?.address?.district}
            </Typography>
            <Typography
              variant="overline"
              sx={{
                fontWeight: 'medium',
              }}
            >
              {currentUser?.address?.state}
              {',  '}
              {currentUser?.address?.pinCode}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            // bgcolor:"red",
          }}
        >
          <Button variant="contained" color="primary" onClick={handleMenuOpen}>
            Change Role (Current: {currentUser?.role})
          </Button>

          <Menu
            anchorEl={menuOpen}
            open={Boolean(menuOpen) }
            onClose={handleMenuClose}
          >
            {ROLES_ENUM.map((item, index) => (
              <MenuItem onClick={() => handleRoleChange(item)} key={item}>
                {item}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Paper>
      <Snack 
        message={snackMessage} 
        openStatus={showSnack} 
        severity={snackSeverity} 
        setOpenStatus={setShowSnack}
      />
      
    </Modal>
  );
}

export default UserManageModal;
