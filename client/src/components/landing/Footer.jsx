import { Box, Avatar, Link, IconButton } from '@mui/material';
import { GitHub } from '@mui/icons-material';
import React from 'react';
function Footer() {
  return (
    <Box
      sx={{
        paddingY: '1rem',
        backgroundColor: '#393434',
        minHeight: '40svh',
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        justifyContent: 'space-between',
        color: 'whitesmoke',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 10,
          paddingY: '2rem',
          justifyContent: 'space-evenly',
          flexGrow: '1',
          //   bgcolor: 'red',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box>
              <Avatar
                alt="Cindy Baker"
                src="/Logo.svg"
                sx={
                  {
                    //   bgcolor: 'whitesmoke',
                  }
                }
              />
            </Box>
            <Box
              sx={{
                fontSize: '2.2rem',
                fontFamily: 'monospace',
              }}
            >
              Urban Resolve
            </Box>
          </Box>
          <Box
            sx={{
              fontFamily: 'ui-rounded',
            }}
          >
            {' '}
            —Smarter Cities Start With You
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              fontFamily: 'ui-rounded',
              fontSize: '1.1rem',
              display: 'flex',
              flexDirection: 'row',
              gap: 1,
            }}
          >
            Email Support:
            <Link
              sx={{
                underline: 'none',
                color: 'inherit',
              }}
              href="mailto:contact.developer.dev@gmail.com"
            >
              contact.developer.dev@gmail.com
            </Link>
          </Box>
          <Box
            sx={{
              fontFamily: 'ui-rounded',
              fontSize: '1.1rem',
              display: 'flex',
              flexDirection: 'row',
              gap: 1,
              justifyContent:"flex-end",
            }}
          >
            <IconButton
              component="a"
              href="https://github.com/abhiishhekk/Complaint_Tracking_System"
              target="_blank"
              rel="noopener noreferrer"
              size='medium'
            >
              <GitHub fontSize='large'/>
            </IconButton>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          flexGrow: '0.3',
          //   bgcolor: 'red',

          alignContent: 'flex-end',

          width: '100%',
          textAlign: 'center',
        }}
      >
        © 2025 Urban Resolve. All Rights Reserved.
      </Box>
    </Box>
  );
}

export default Footer;
