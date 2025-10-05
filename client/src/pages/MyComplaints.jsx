import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import apiClient from '../api/axios';
import Grid from '@mui/material/Grid';
import ComplaintCard from '../components/ComplaintCard';

function MyComplaints() {
  const [complaintss, setComplaint] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
  
  async function fetchData() {
  setLoading(true);
  setError('');
  try {
    const response = await apiClient.get('/complaint/userComplaintDashboard');
    if (response.status !== 200) {
      setError('unable to fetch dashboard, try again later');
      alert(error);
    }
    console.log(response);
    setComplaint(response.data.data);
    console.log(complaintss.length);
  } catch (err) {
    setError('Failed to fetch complaints. Please try again.');
    console.error('Dashboard fetch error:', err);
  } finally {
    setLoading(false);
  }
  }
  fetchData();
},[]);



  if (loading) {
    return <Box>LOADING...</Box>;
  } else if (error.length > 0) {
    return (
      <Typography
        color="error"
        sx={{
          textAlign: 'center',
          mt: 4,
        }}
      >
        {error}
      </Typography>
    );
  } else {
    return (
      <Box>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 'bold',
          }}
        >
          Blog
        </Typography>
        <Typography
          sx={{
            marginY: '1rem',
          }}
        >
          Stay updated with problems and developments in your city.
        </Typography>
        <Container>
          <Grid container spacing={3}>
            {complaintss.length > 0 ? (
              complaintss.map((complaint) => (
                <Grid item xs={12} sm={6} md={4} key={complaint._id}>
                  <ComplaintCard complaint={complaint} />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography sx={{ mt: 4 }}>
                  No complaints found in your area.
                </Typography>
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>
    );
  }
}

export default MyComplaints