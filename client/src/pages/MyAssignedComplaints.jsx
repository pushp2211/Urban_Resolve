import React, { useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import ComplaintList from '../components/ComplaintList';
import { Box } from '@mui/material';

function MyAssignedComplaints() {
  const { user } = useAuth();

  const filter = useMemo(() => {
    return user?._id ? { assignedTo: user._id } : {};
  }, [user?._id]);

  return (
    <Box
      sx={{
        width: '100%',
        marginY: '2rem',
      }}
    >
      <ComplaintList filter={filter} />
    </Box>
  );
}

export default MyAssignedComplaints;
