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
          width: '100%',
          borderRadius: 2,
          boxShadow: 3,
          maxHeight: 'calc(100vh - 155px)',
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.3)',
            },
          },
        }}
      >
        <CardContent sx={{ p: 2 }}>
          {/* User Info - Clickable */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              mb: 1.5,
              cursor: 'pointer',
              p: 0.75,
              borderRadius: 1,
              transition: 'background 0.2s',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
            onClick={() => handleUserClick(complaint.submittedBy)}
          >
            <Avatar
              alt={complaint.submittedBy?.fullName}
              src={complaint.submittedBy?.profilePicture}
              sx={{ width: 48, height: 48 }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {complaint.submittedBy?.fullName}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'block',
                }}
              >
                {complaint.submittedBy?.email}
              </Typography>
            </Box>
            <Chip
              label={complaint.status}
              color={getStatusColor(complaint.status)}
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </Box>

          <Divider sx={{ mb: 1.5 }} />

          {/* Complaint Title */}
          <Typography variant="h6" fontWeight={700} gutterBottom>
            {complaint.title}
          </Typography>

          {/* Images */}
          {complaint.photoUrl && (
            <Box
              sx={{
                width: '100%',
                height: 180,
                overflow: 'hidden',
                borderRadius: 1.5,
                boxShadow: 2,
                bgcolor: 'background.paper',
                mb: 1.5,
              }}
            >
              <img
                src={complaint.photoUrl}
                alt={complaint.title || 'Complaint photo'}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </Box>
          )}

          {/* Description */}
          <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
            <DescriptionIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
            <Typography variant="body2" color="text.secondary">
              {complaint.description}
            </Typography>
          </Box>

          <Divider sx={{ my: 1.5 }} />

          {/* Details Grid */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {/* Type and Urgency */}
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <CategoryIcon sx={{ color: 'primary.main', fontSize: 18 }} />
                <Typography variant="caption" color="text.secondary">
                  Type:
                </Typography>
                <Chip
                  label={complaint.type}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ height: 20, fontSize: '0.7rem' }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <PriorityHighIcon
                  sx={{
                    color:
                      getUrgencyColor(complaint.urgency) === 'error'
                        ? 'error.main'
                        : 'warning.main',
                    fontSize: 18,
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  Urgency:
                </Typography>
                <Chip
                  label={complaint.urgency}
                  size="small"
                  color={getUrgencyColor(complaint.urgency)}
                  sx={{ height: 20, fontSize: '0.7rem' }}
                />
              </Box>
            </Box>

            {/* Date */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <CalendarTodayIcon
                sx={{ color: 'text.secondary', fontSize: 18 }}
              />
              <Typography variant="caption" color="text.secondary">
                Submitted:
              </Typography>
              <Typography variant="caption" fontWeight={600}>
                {formatDate(complaint.createdAt)}
              </Typography>
            </Box>

            {/* Location */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75 }}>
              <LocationOnIcon
                sx={{ color: 'error.main', fontSize: 18, mt: 0.25 }}
              />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {complaint.address?.street && `${complaint.address.street}, `}
                  {complaint.address?.district}, {complaint.address?.state} -{' '}
                  {complaint.address?.pinCode}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Assigned To (if any) */}
          {complaint.assignedTo && (
            <>
              <Divider sx={{ my: 1.5 }} />
              <Box>
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color="primary.main"
                  gutterBottom
                  display="block"
                >
                  Assigned To
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    //   mb: 1.5,
                    cursor: 'pointer',
                    paddingX: 0.75,
                    borderRadius: 1,
                    transition: 'background 0.2s',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                  onClick={() => {
                    handleUserClick(complaint?.assignedTo);
                  }}
                >
                  <Avatar
                    src={complaint.assignedTo?.profilePicture}
                    alt={complaint.assignedTo?.fullName}
                    sx={{ width: 28, height: 28 }}
                  />
                  <Box>
                    <Typography variant="caption" fontWeight={600}>
                      {complaint.assignedTo?.fullName}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      sx={{ fontSize: '0.65rem' }}
                    >
                      {complaint.assignedTo?.email}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </>
          )}
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
          //   onUserUpdate={(updatedUser) => {
          //     setComplaint((prev) => ({
          //       ...prev,
          //       submittedBy: updatedUser,
          //     }));
          //   }}
        />
      )}
    </>
  );
}

export default AdminComplaintCard;
