import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Avatar,
  Chip,
  Divider,
  IconButton,
  ImageList,
  ImageListItem,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CategoryIcon from '@mui/icons-material/Category';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import DescriptionIcon from '@mui/icons-material/Description';
import { COMPLAINT_STATUS } from '../../../enum/ComplaintStatus';
import { COMPLAINT_TYPE } from '../../../enum/ComplaintType';
import { COMPLAINT_URGENCY } from '../../../enum/ComplaintUrgency';
import { getComplaint } from '../../api/getComplaintDetail';
import { useLoading } from '../../context/LoadingContext';
import UserDetailsModal from './UserDetailsModal';
import apiClient from '../../api/axios';

function AdminComplaintCard({ complaint, onUserClick }) {
  //   const [complaint, setComplaint] = useState(null);
  console.log(complaint);
  const [error, setError] = useState('');
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const { showLoading, hideLoading } = useLoading();

  //   useEffect(() => {
  //     const fetchComplaint = async () => {
  //       showLoading();
  //       setError('');
  //       try {
  //         const response = await getComplaint(id);
  //         setComplaint(response.data.data);
  //       } catch (error) {
  //         setError(error.response?.data?.message || 'Failed to load complaint');
  //         console.error(error);
  //       } finally {
  //         hideLoading();
  //       }
  //     };

  //     if (id) {
  //       fetchComplaint();
  //     }
  //   }, [id]);

  const handleUserClick = async (userObj) => {
    if (userObj && userObj._id) {
      setLoadingUser(true);
      showLoading();
      try {
        // Fetch full user details with complaint stats
        const response = await apiClient.get('/admin/user', {
          params: { email: userObj.email },
        });
        setSelectedUser(response.data.data);
        setUserModalOpen(true);
      } catch (err) {
        console.error('Failed to fetch user details:', err);
        setError('Failed to load user details');
      } finally {
        setLoadingUser(false);
        hideLoading();
      }
    }
  };

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
      case COMPLAINT_STATUS.PENDING_REVIEW:
        return 'info';
      default:
        return 'default';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case COMPLAINT_URGENCY.LOW:
        return 'success';
      case COMPLAINT_URGENCY.MEDIUM:
        return 'warning';
      case COMPLAINT_URGENCY.HIGH:
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (error) {
    return (
      <Card sx={{ width: '100%' }}>
        <CardContent>
          <Typography color="error">{error}</Typography>
        </CardContent>
      </Card>
    );
  }

  if (!complaint) {
    return null;
  }

  return (
    <>
      <Card
        sx={{
          height: '100%',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: 'none',
          position: 'sticky',
          top: 16,
          // width:"100%"
        }}
      >
        <CardContent
          sx={{
            p: 2.5,
            display: 'flex',
            flexDirection: {
              xs: 'column',
              md: 'row',
              lg: 'row',
            },
            justifyContent: 'space-around',
            alignItems: 'center',
            gap: {
              md: 5,
            },
            width: {
              // md:"100%",
              // ms:"auto"
              // xs:"100%"
            },
          }}
        >
          {/* Header with Status Badges */}
          <Box
            sx={{
              maxWidth: '33rem',
            }}
          >
            <Box
              sx={{
                mb: 1,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Typography
                variant="h6"
                fontWeight={600}
                sx={{ lineHeight: 1.3,
                  maxWidth:"60%",
                 }}
              >
                {complaint.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap', 
               paddingLeft:"1rem"  
               }}>
                <Chip
                  label={complaint.status}
                  color={getStatusColor(complaint.status)}
                  size="small"
                  sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                />
                <Chip
                  label={complaint.urgency}
                  color={getUrgencyColor(complaint.urgency)}
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                />
                <Chip
                  label={complaint.type}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.75rem' }}
                />
              </Box>
            </Box>

            {/* Image */}
            {complaint.photoUrl && (
              <Box
                sx={{
                  width: '100%',
                  height: 200,
                  overflow: 'hidden',
                  borderRadius: 1.5,
                  bgcolor: 'background.default',
                  mb: 2,
                }}
              >
                <img
                  src={complaint.photoUrl}
                  alt={complaint.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            )}

            {/* Description */}
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
                lineHeight: 1.6,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {complaint.description}
            </Typography>

            <Divider sx={{ my: 2 }} />
          </Box>

          {/* User Info */}
          <Box
            sx={{
              minWidth: {
                md: '20rem',
                xs: '20rem',
              },
              paddingX: {
                xs: 2,
              },
              display:"flex",
              flexDirection:{
                xs:"column",
                sm:"row",
                md:"column",
                lg:"column"
              },
              gap:1,
              // bgcolor:"red"
              alignItems:"start"
            }}
          >
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  mb: 2,
                  p: 1,
                  borderRadius: 1.5,
                  bgcolor: 'background.default',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                  minWidth:"15rem"
                }}
                onClick={() => handleUserClick(complaint.submittedBy)}
              >
                <Avatar
                  src={complaint.submittedBy?.profilePicture}
                  sx={{ width: 40, height: 40 }}
                >
                  {complaint.submittedBy?.fullName?.[0]}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    sx={{ fontSize: '0.7rem' }}
                  >
                    Submitted by
                  </Typography>
                  <Typography variant="body2" fontWeight={600} noWrap>
                    {complaint.submittedBy?.fullName}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    noWrap
                    display="block"
                  >
                    {complaint.submittedBy?.email}
                  </Typography>
                </Box>
              </Box>

              {/* Details */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarTodayIcon
                    sx={{ fontSize: 16, color: 'text.secondary' }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(complaint.createdAt)}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <LocationOnIcon
                    sx={{ fontSize: 16, color: 'text.secondary', mt: 0.25 }}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ lineHeight: 1.5 }}
                  >
                    {complaint.address?.locality &&
                      `${complaint.address.locality}, `}
                    {complaint.address?.district}, {complaint.address?.state} -{' '}
                    {complaint.address?.pinCode}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Assigned To */}
            {complaint.assignedTo && (
              <>
                <Divider sx={{ my: 2 }} />
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    justifyContent: 'center',
                    minWidth:"15rem"
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      p: 1,
                      borderRadius: 1.5,
                      bgcolor: 'background.default',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                    onClick={() => handleUserClick(complaint.assignedTo)}
                  >
                    <Avatar
                      src={complaint.assignedTo?.profilePicture}
                      sx={{ width: 32, height: 32 }}
                    >
                      {complaint.assignedTo?.fullName?.[0]}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        sx={{ fontSize: '0.7rem' }}
                      >
                        Assigned to
                      </Typography>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {complaint.assignedTo?.fullName}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                        display="block"
                      >
                        {complaint.assignedTo?.email}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarTodayIcon
                      sx={{ fontSize: 16, color: 'text.secondary' }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(complaint?.assignedAt)}
                    </Typography>
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* User Details Modal */}
      {selectedUser && (
        <UserDetailsModal
          open={userModalOpen}
          user={selectedUser}
          onClose={() => {
            setUserModalOpen(false);
            setSelectedUser(null);
          }}
        />
      )}
    </>
  );
}

export default AdminComplaintCard;
