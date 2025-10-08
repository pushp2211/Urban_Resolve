import React from 'react'
import { useAuth } from '../context/AuthContext'
import ComplaintList from '../components/ComplaintList';
import { Box } from '@mui/material';
function MyAssignedComplaints() {
    const {user} = useAuth();

    const filter = {
        assignedTo : user._id
    }
  return (
    <Box
        sx={{
          width:'100%',
          marginY:'2rem'
        }}
      >
        <ComplaintList filter={filter}/>
      </Box>
  )
}

export default MyAssignedComplaints