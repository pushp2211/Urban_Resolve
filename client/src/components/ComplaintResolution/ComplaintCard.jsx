import React from 'react';

import { getComplaint } from '../../api/getComplaintDetail';
import { useState } from 'react';
import { useEffect } from 'react';
import { useLoading } from '../../context/LoadingContext';
import { Box, Typography, Avatar, Chip } from '@mui/material';
import { COMPLAINT_STATUS } from '../../../enum/ComplaintStatus';
import { useTheme } from '@mui/material/styles';
import { COMPLAINT_URGENCY } from '../../../enum/ComplaintUrgency';
function ComplaintCard({ id, sx, setCurComplaint }) {
  const getStatusColor = (status) => {
    switch (status) {
      case COMPLAINT_STATUS.PENDING:
        return 'warning';
      case COMPLAINT_STATUS.IN_PROGRESS:
        return 'primary';
      case COMPLAINT_STATUS.RESOLVED:
        return 'success';
      case COMPLAINT_STATUS.REJECTED:
        return 'error';
      default:
        return 'default';
    }
  };
  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case COMPLAINT_URGENCY.MEDIUM:
        return 'warning';
      case COMPLAINT_URGENCY.LOW:
        return 'primary';
      case COMPLAINT_URGENCY.HIGH:
        return 'error';
      default:
        return 'default';
    }
  };
  const theme = useTheme();
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState('');
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    const fetchComplaint = async () => {
      showLoading();
      setError('');
      try {
        const response = await getComplaint(id);
        // console.log(response.data.data);
        setComplaint(response.data.data); // Get complaint from response.data.data
        setCurComplaint(response.data.data);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to load complaint');
        console.error(error);
      } finally {
        hideLoading();
      }
    };

    if (id) {
      fetchComplaint();
    }
  }, [id]);
  return (
    <Box
      sx={[
        {
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          minWidth: {
            md: '41%',
          },
          maxWidth: {
            md: '41%',
          },
          margin: 2,
          marginTop: {
            xs: 3,
            md: 8,
          },
        },
        sx,
      ]}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Avatar alt="User" src={complaint?.submittedBy?.profilePicture} />
          <Typography>{complaint?.submittedBy?.fullName}</Typography>
        </Box>

        <Box>
          <Chip
            label={complaint?.status}
            variant="outlined"
            color={getStatusColor(complaint?.status)}
            // size="small"
          />
        </Box>
      </Box>
      <Box>
          <Typography variant='overline' color='warning'>
            {complaint?.title}
          </Typography>
      </Box>

      <Box
        sx={{
          width: '100%',
          height: 240,
          overflow: 'hidden',
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <img
          src={complaint?.photoUrl}
          alt={complaint?.title || 'Complaint photo'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {complaint?.createdAt &&
            new Date(complaint.createdAt).toLocaleString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {complaint?.type}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 1.5,
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent:"flex-end"
        }}
      >
        <Chip
          label={complaint?.urgency}
          color={getUrgencyColor(complaint?.urgency)}
          size="small"
          sx={{
            fontWeight: 600,
            textTransform: 'capitalize',
          }}
        />
        {complaint?.address && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              px: 1.5,
              py: 0.5,
              borderRadius: 3,
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
            }}
          >
            {/* <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
              📍
            </Typography> */}
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
              {complaint.address.locality}, {complaint.address.district}
            </Typography>
          </Box>
        )}
      </Box>
      
      {complaint?.description && (
        <Box
          sx={{
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
            padding: 2,
            borderRadius: 2,
            borderLeft: '3px solid',
            borderColor: 'primary.main',
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Description
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5, lineHeight: 1.6 }}>
            {complaint.description}
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          backgroundColor:
                theme.palette.mode === 'dark' ? '#3c4042' : '#f1f0fa',
              padding: 2,
              borderRadius: 5,
        }}
      >
        {!complaint?.resolutionReview &&
          complaint?.status === COMPLAINT_STATUS.PENDING_REVIEW && (
            <Box>
              <Typography>Resolution request is pending.</Typography>
              <Typography
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                Requested at:
                <Typography variant="body2" color="text.primary">
                  {complaint?.resolutionRequest &&
                    new Date(
                      complaint.resolutionRequest?.submittedAt
                    ).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                </Typography>
              </Typography>
              <Typography
                sx={{
                  display:'flex',
                  flexDirection:"row",
                  gap:1,
                  alignItems:"center",
                  justifyContent:"flex-start"
                }}
              >
                Note:
                <Typography>
                  {complaint?.resolutionRequest?.notes}
                </Typography>
              </Typography>
            </Box>
          )}
        {!complaint?.resolutionReview &&
          complaint?.status === COMPLAINT_STATUS.IN_PROGRESS && (
            <Typography>No resolution request has been made yet</Typography>
          )}
        {complaint?.resolutionReview && (
          <Box
            sx={{
              // backgroundColor:
              //   theme.palette.mode === 'dark' ? '#3c4042' : '#f1f0fa',
              // padding: 2,
              // borderRadius: 5,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box>
                {complaint?.resolutionReview?.approved === true ? (
                  <Chip label="Approved" color="success" size="small"/>
                ) : (
                  <Chip label="Rejected" color="error" size="small"/>
                )}
              </Box>
              <Typography
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                Reviewed at:
                <Typography variant="body2" color="text.primary">
                  {complaint?.resolutionReview &&
                    new Date(
                      complaint.resolutionReview?.reviewedAt
                    ).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                </Typography>
              </Typography>
            </Box>

            {complaint?.resolutionReview?.rejectionReason && <Box>
              <Typography>
                Remark: {complaint?.resolutionReview?.rejectionReason}
              </Typography>
            </Box>}
          </Box>
        )}
      </Box>
      {/* <Typography>{complaint?.description}</Typography> */}
    </Box>
  );
}

export default ComplaintCard;
