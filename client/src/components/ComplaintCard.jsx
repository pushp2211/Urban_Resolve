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
import { useEffect } from 'react';
import apiClient from '../api/axios';
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
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [countLoading, setCountLoading] = useState(false);
  const [countLoadingError, setCountLoadingError] = useState(false);
  useEffect(() => {
    const fetchUpvoteStatus = async () => {
      setCountLoading(true);
      setCountLoadingError("")
      try {
        const response = await apiClient.get(
          `/dashboard/complaints/${complaint._id}/upvote`
        );
        const { isUpvoted, totalUpvotes } = response.data.data;
        setIsUpvoted(isUpvoted);
        setUpvoteCount(totalUpvotes);
      } catch (error) {
        setCountLoadingError("Error while loading vote count")
        console.error('Error fetching upvote status:', error);
      } finally {
        setCountLoading(false);
      }
    };

    fetchUpvoteStatus();
  }, [complaint._id]);

  const handleUpVote = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCountLoading(true);
    setCountLoadingError("");
    try {
      const response = await apiClient.put(
        `/dashboard/complaints/${complaint._id}/toggleUpvote`
      );
      const { isUpvoted, total } = response.data.data;
      // console.log(response.data.data);
      // console.log(total)
      setIsUpvoted(isUpvoted);
      setUpvoteCount(total);
    } catch (error) {
      setCountLoadingError("error while toggle upvote");
      console.error('Error toggling upvote:', error);
    }
    finally{
      setCountLoading(false);
    }
  };

  return (
    <Card
      variant="outlined"
      sx={{
        width: {
          xs: '23rem', // extra-small devices: full width
          sm: '33rem', // small devices: 25rem
          md: '40rem', // medium devices: 30rem
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
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Box>
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
              height: '3rem',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Button onClick={handleUpVote} sx={{}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={isUpvoted?"red":""} stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-big-up-icon lucide-arrow-big-up"><path d="M9 13a1 1 0 0 0-1-1H5.061a1 1 0 0 1-.75-1.811l6.836-6.835a1.207 1.207 0 0 1 1.707 0l6.835 6.835a1 1 0 0 1-.75 1.811H16a1 1 0 0 0-1 1v6a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1z"/></svg>
            </Button>
            {upvoteCount}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default ComplaintCard;
