import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { COMPLAINT_STATUS } from '../../enum/ComplaintStatus';
import { useState } from 'react';
import Button from '@mui/material/Button';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
// Function to get a color for the status chip
const getStatusColor = (status) => {
  switch (status) {
    case COMPLAINT_STATUS.PENDING:
      return 'warning';
    case COMPLAINT_STATUS.IN_PROGRESS:
      return 'primary';
    case COMPLAINT_STATUS.RESOLVED:
      return 'success';
    case COMPLAINT_STATUS.REJECTED:
      return 'danger';
    default:
      return 'default';
  }
};

function ComplaintCard({ complaint }) {
  const [count, setCount] = useState(0);
  const handleOnClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCount((prev) => prev + 1);
  };

  return (
    <Card
      variant="outlined"
      sx={{
        width: {
          xs: '20rem', // extra-small devices: full width
          sm: '25rem', // small devices: 25rem
          md: '30rem', // medium devices: 30rem
          lg: '33rem', // large devices: 35rem
          xl: '40rem', // extra large devices: 40rem
        },
        borderRadius: '1rem',
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {complaint.address?.city}, {complaint.address.pinCode}
          </Typography>
          <Chip
            label={complaint.status}
            color={getStatusColor(complaint.status)}
            size="small"
          />
        </Box>
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            paddingTop: '56.25%', // 16:9 aspect ratio (9/16 = 0.5625 * 100)
            overflow: 'hidden',
            borderRadius: 1,
            marginY: '1rem',
          }}
        >
          <Box
            component="img"
            src={complaint.photoUrl}
            alt="loading..."
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </Box>
        <Box
          sx={{
              display:"flex",
              justifyContent:"space-between"
            }}
            
        >
          <Box
          >
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: 'bold' }}
            >
              {complaint.title}
            </Typography>
            <Typography variant="">{complaint.description}</Typography>
            <Typography sx={{ mt: 1.5 }} color="text.secondary">
              {new Date(complaint.createdAt).toLocaleDateString()}
              {'  '}
              {complaint.address.district}
            </Typography>
          </Box>

          <Box
            sx={{
              height:"3rem",
              display:"flex",
              alignItems:"center"
            }}
          >
            <Button onClick={handleOnClick}
            sx={{
              

            }}
          >
            <ThumbUpIcon 
              color='action'
            />
          </Button>
          {count}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default ComplaintCard;
