import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Avatar,
  Divider,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

function OriginalComplaintDetails({ complaint, onUserClick }) {
  const theme = useTheme();

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'High':
        return 'error';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'In Progress':
        return 'primary';
      case 'Resolved':
        return 'success';
      case 'Rejected':
        return 'error';
      case 'Pending Review':
        return 'info';
      default:
        return 'default';
    }
  };

  if (!complaint) return null;

  return (
    <Box>
      {/* Header with Status */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 2,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            {complaint.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label={complaint.status}
              color={getStatusColor(complaint.status)}
              size="small"
            />
            <Chip
              label={complaint.urgency}
              color={getUrgencyColor(complaint.urgency)}
              size="small"
            />
            <Chip label={complaint.type} variant="outlined" size="small" />
          </Box>
        </Box>
      </Box>

      {/* User Info */}
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', marginBottom: 0.5 }}>
          Submitted by
        </Typography>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            cursor: onUserClick ? 'pointer' : 'default',
            borderRadius: 1,
            p: 0.5,
            mx: -0.5,
            transition: 'background-color 0.2s',
            '&:hover': onUserClick ? {
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
            } : {}
          }}
          onClick={() => onUserClick && onUserClick(complaint.submittedBy?.email)}
        >
          <Avatar
            src={complaint.submittedBy?.profilePicture}
            sx={{ width: 32, height: 32 }}
          >
            {complaint.submittedBy?.fullName?.[0]}
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="body2" fontWeight={500}>
              {complaint.submittedBy?.fullName}
            </Typography>
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'block'
              }}
            >
              {complaint.submittedBy?.email}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Date & Location */}
      <Box sx={{ marginBottom: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 1 }}>
          <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {new Date(complaint.createdAt).toLocaleString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary', marginTop: 0.3 }} />
          <Typography variant="body2" color="text.secondary">
            {complaint.address.locality}, {complaint.address.city}, {complaint.address.district}
            <br />
            {complaint.address.state} - {complaint.address.pinCode}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ marginY: 2 }} />

      {/* Description */}
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Description
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          {complaint.description}
        </Typography>
      </Box>

      {/* Original Complaint Photo */}
      {complaint.photoUrl && (
        <Box>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Complaint Photo
          </Typography>
          <Box
            sx={{
              width: '100%',
              maxHeight: 300,
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: 2,
            }}
          >
            <img
              src={complaint.photoUrl}
              alt={complaint.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </Box>
        </Box>
      )}

      {/* Assigned Staff Info */}
      {complaint.assignedTo && (
        <Box sx={{ marginTop: 2, paddingTop: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', marginBottom: 0.5 }}>
            Assigned to
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar
              sx={{ width: 28, height: 28, bgcolor: theme.palette.primary.main }}
              src={complaint.assignedTo?.profilePicture}
            >
              {complaint.assignedTo?.fullName?.[0]}
            </Avatar>
            <Typography variant="body2" fontWeight={500}>
              {complaint.assignedTo?.fullName}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default OriginalComplaintDetails;
