import React, { useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import ComplaintList from '../components/ComplaintList';
import { useAuth } from '../hooks/useAuth';

function MyComplaints() {
  const { user } = useAuth();

  const userSpecificFilter = useMemo(() => {
    return user?._id ? { submittedBy: user._id } : {};
  }, [user?._id]);

  return (
    <Box
      sx={{
        width: '100%',
        marginY: '2rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <Container
        disableGutters
        sx={{
          paddingX: 4,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 'bold',
            }}
          >
            Citizen Stories
          </Typography>
          <Typography
            variant="overline"
            sx={{
              fontSize: '0.9rem',
            }}
          >
            Every Issue Matters. Every Voice Counts.
          </Typography>
        </Box>
      </Container>
      <ComplaintList filter={userSpecificFilter} />
    </Box>
  );
}

export default MyComplaints;
