import React from 'react';
import Marquee from 'react-fast-marquee';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

import { useTheme } from '@emotion/react';
function MarqueeEffect() {
  const theme = useTheme();
  const curTheme = theme.palette.mode;
  const images = [
    { title: 'Dashboard', path: '/Homepage.png', description: 'A dynamic and intuitive control center that brings together recent activities, and quick-access tools, helping users track complaint progress and overall system health at a glance.' },
    {
      title: 'Complaint Details',
      path: '/Complaint_detailed_card.png',
      description: 'A dedicated and structured view that showcases every aspect of a complaint, timestamps, and assigned staff, enabling seamless tracking and clearer communication.',
    },
    { title: 'Filters', path: '/Filters.png', description: 'An efficient filtering system that allows users to narrow down complaints based on address, current month or status, ensuring faster discovery and smoother workflow management.' },
    { title: 'Live Notifications', path: '/Notifications.png', description: 'A real-time alert system that instantly updates users about complaint status changes, staff actions, and important system activities, ensuring no critical event goes unnoticed.' },
    { title: 'Profile Page', path: '/Profile_page.png', description: 'A personalized space where users can manage their identity, view account information, update details, and maintain a secure presence within the system.' },
    { title: 'Live status', path: '/Status.png', description: 'A continuously updating interface that displays the current state of submitted complaints, allowing citizens to follow their issue’s journey from submission to resolution.' },
  ];
  return (
    <Marquee pauseOnHover={true}  gradientWidth={50}
      gradient={curTheme==="dark"? false: true}
      style={{
        
      }}
    >
      {images.map((e, id) => (
        <Card

          key={id}
          sx={{
            maxWidth: 340,
            margin:"1.5rem",
            borderRadius:"1rem"
            // minHeight:350
          }}
        >
          <CardActionArea>
            <CardMedia
              component="img"
              height="100"
              image={e.path}
              alt="green iguana"
              sx={{
                height: 180, // fixed height for ALL images
                width: '100%', // full width of card
                objectFit: 'cover', // crop and fill uniformly
              }}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {e.title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {e.description}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Marquee>
  );
}

export default MarqueeEffect;
