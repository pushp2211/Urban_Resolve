import React from 'react';
import Marquee from 'react-fast-marquee';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
function MarqueeEffect() {
  const images = [
    { title: 'Dashboard', path: '/Homepage.png', description: '' },
    {
      title: 'Complaint Details',
      path: '/Complaint_detailed_card.png',
      description: '',
    },
    { title: 'Filters', path: '/Filters.png', description: '' },
    { title: 'Live Notifications', path: '/Notifications.png', description: '' },
    { title: 'Profile Page', path: '/Profile_page.png', description: '' },
    { title: 'Live status', path: '/Status.png', description: '' },
  ];
  return (
    <Marquee pauseOnHover={true} gradient={true} gradientWidth={50}
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
                Lizards are a widespread group of squamate reptiles, with over
                6,000 species, ranging across all continents except Antarctica
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Marquee>
  );
}

export default MarqueeEffect;
