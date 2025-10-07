import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Avatar, Container } from '@mui/material';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const {user} = useAuth();
  return (
    <Container
      sx={{
        bgcolor: 'gray',
        minHeight: '78svh',
        overflow: 'hidden',
        display: 'flex',
        gap: '4',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          height: '100%',
          flexGrow: 1,
          display:"flex",
          // justifyContent:"center",
          flexDirection:"column",
          alignItems:"center",
          gap:4,
        }}
      >
        <Avatar
          alt={user.fullName}
          src={user.profilePicture}
          sx={{ width: 130, height: 130 }}
        />

        


      </Box>

      <Box
        sx={{
          height: '100%',
          flexGrow: 1,
          bgcolor: 'green',
        }}
      >
        wnw
      </Box>
    </Container>
  );
}

export default Profile;
