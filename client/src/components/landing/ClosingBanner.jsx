import React from 'react';
import { Box, Typography } from '@mui/material';
function ClosingBanner() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <Typography
        sx={{
            fontFamily:"initial",
            fontSize:"1.3rem"
        }}
      >
        Let’s build cities that respond, care, and evolve — together. Urban
        Resolve connects citizens and authorities through fast reporting,
        transparent tracking, and collective action. Join us today and take part
        in shaping a cleaner, safer, and more responsive community. Your
        contribution matters more than you think.
      </Typography>
    </Box>
  );
}

export default ClosingBanner;
