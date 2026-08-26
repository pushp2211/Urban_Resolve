import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import ComplaintList from '../components/ComplaintList';
import Box from '@mui/material/Box';
import { useAuth } from '../hooks/useAuth';

function Home() {
  const location = useLocation();
  const { user } = useAuth();
  const district = user?.address?.district;

  const queryParams = useMemo(() => {
    const params = Object.fromEntries(new URLSearchParams(location.search));
    if (district) {
      params['district'] = district;
    }
    return params;
  }, [location.search, district]);

  return (
    <Box
      sx={{
        width: '100%',
      }}
    >
      <ComplaintList filter={queryParams} />
    </Box>
  );
}

export default Home;
