import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import ComplaintList from '../components/ComplaintList';
import Box from '@mui/material/Box';

// const [error, setError] = useState('');
// const [complaints, setComplaints] = useState([]);

function Home() {
  const location = useLocation();
  const queryParams = Object.fromEntries(new URLSearchParams(location.search));
  console.log(queryParams);
  // const dateRange = queryParams.get('dateRange');
  // const [loading, setLoading] = useState(false);
  console.log(location.pathname);
  return (
      <Box
        sx={{
          width:'100%',
          marginY:'2rem'
        }}
      >
        <ComplaintList filter={queryParams}/>
      </Box>
  )
}

export default Home