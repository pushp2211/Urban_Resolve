import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import apiClient from '../api/axios';
import ComplaintCard from '../components/ComplaintCard';
import ComplaintList from '../components/ComplaintList';
import { useAuth } from '../context/AuthContext';
import FilterBar from '../components/FilterBar';
import NotificationButton from '../components/NotificationButton';
function MyComplaints() {
  // const [complaintss, setComplaint] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState('');

  const {user} = useAuth();
//   useEffect(() => {
  
//   async function fetchData() {
//   setLoading(true);
//   setError('');
//   try {
//     const response = await apiClient.get('/complaint/userComplaintDashboard');
//     if (response.status !== 200) {
//       setError('unable to fetch dashboard, try again later');
//       alert(error);
//     }
//     console.log(response);
//     setComplaint(response.data.data);
//     console.log(complaintss.length);
//   } catch (err) {
//     setError('Failed to fetch complaints. Please try again.');
//     console.error('Dashboard fetch error:', err);
//   } finally {
//     setLoading(false);
//   }
//   }
//   fetchData();
// },[]);

  const userSpecificFilter = {
    submittedBy: user?._id, // Assuming you want to filter by the logged-in user's ID
  };

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
          <NotificationButton/>
      </Container>
        {/* <FilterBar/> */}
        <ComplaintList filter={userSpecificFilter}/>
      </Box>
    );
}

export default MyComplaints