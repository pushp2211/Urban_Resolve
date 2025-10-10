import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import apiClient from '../api/axios';
import Grid from '@mui/material/Grid';
import ComplaintCard from '../components/ComplaintCard';
import FilterBar from '../components/FilterBar';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@mui/material';
import NotificationButton from '../components/NotificationButton';
import ReportModalButton from '../components/ReportModalButton';
import ReportModal from '../components/ReportModal';
function Dashboard() {
  return (
    <Box
      sx={{
        width:'100%',
          marginY:'2rem',
          display:"flex",
          justifyContent:"center",
          alignItems:"center",
          flexDirection:"column"
      }}
    >
      <Container
        disableGutters
        // maxWidth="xl"
        sx={{
          // marginY:'2rem',
          paddingX:4,
          display:"flex",
          flexDirection:"row",
          justifyContent:"space-between",
          alignItems:"center"
        }}
      >
        <Box>
          <Typography
          variant='h3'
          sx={{
            fontWeight:'bold'
          }}
        >
          Citizen Stories
        </Typography>
        <Typography
          variant='overline'
          sx={{
            fontSize:'0.9rem'
          }}
        >
          Every Issue Matters. Every Voice Counts.
          
        </Typography>
        </Box>
          
      </Container>
      <Outlet/>
    </Box>
  )
}
export default Dashboard;
