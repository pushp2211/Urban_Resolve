import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  Avatar,
  IconButton,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LocationOnIcon from '@mui/icons-material/LocationOn';

function ReviewComplaintCardCompact({ complaint, onClick }) {
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

  const photos = complaint.resolutionRequest?.photos || [];

  return (
    <Card
      sx={{
        marginBottom: 2,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        borderLeft: `4px solid ${
          complaint.urgency === 'High'
            ? theme.palette.error.main
            : complaint.urgency === 'Medium'
            ? theme.palette.warning.main
            : theme.palette.info.main
        }`,
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
        },
      }}
      onClick={onClick}
    >
      <CardContent sx={{ paddingY: 1.5, paddingX: 2, '&:last-child': { paddingBottom: 1.5 } }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* Photo Preview - 2 columns grid layout */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 0.5,
              minWidth: { xs: 70, sm: 120 },
              alignContent: 'start',
            }}
          >
            {photos.slice(0, 2).map((photo, index) => (
              <Box
                key={index}
                sx={{
                  width: { xs: 35, sm: 56 },
                  height: { xs: 35, sm: 56 },
                  borderRadius: { xs: 1, sm: 1.5 },
                  overflow: 'hidden',
                  flexShrink: 0,
                  boxShadow: 1,
                }}
              >
                <img
                  src={photo}
                  alt={`Preview ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            ))}
            {photos.length > 2 && (
              <Box
                sx={{
                  width: { xs: 35, sm: 56 },
                  height: { xs: 35, sm: 56 },
                  borderRadius: { xs: 1, sm: 1.5 },
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  boxShadow: 1,
                  gridColumn: photos.length === 2 ? 'span 2' : 'auto',
                }}
              >
                <Typography variant="body2" fontWeight={700} sx={{ fontSize: { xs: '0.65rem', sm: '1rem' } }}>
                  +{photos.length - 2}
                </Typography>
                <Typography variant="caption" sx={{ fontSize: { xs: '0.45rem', sm: '0.6rem' }, display: { xs: 'none', sm: 'block' } }}>
                  more
                </Typography>
              </Box>
            )}
          </Box>

          {/* Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Title and Chips */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                marginBottom: 0.5,
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={600}
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flex: 1,
                }}
              >
                {complaint.title}
              </Typography>
              <Chip
                label={complaint.urgency}
                color={getUrgencyColor(complaint.urgency)}
                size="small"
              />
            </Box>

            {/* Users */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                marginBottom: 0.5,
                flexWrap: { xs: 'wrap', sm: 'nowrap' },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Avatar
                  src={complaint.submittedBy?.profilePicture}
                  sx={{ width: 20, height: 20 }}
                />
                <Typography variant="caption" color="text.secondary" noWrap>
                  {complaint.submittedBy?.fullName}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Avatar sx={{ width: 20, height: 20, bgcolor: theme.palette.primary.main }}
                  src={complaint.assignedTo?.profilePicture}
                >
                  {complaint.assignedTo?.fullName?.[0]}
                </Avatar>
                <Typography variant="caption" color="text.secondary" noWrap>
                  Staff: {complaint.assignedTo?.fullName}
                </Typography>
              </Box>
            </Box>

            {/* Location */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, marginBottom: 0.5 }}>
              <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary" noWrap>
                {complaint.address.city}, {complaint.address.state}
              </Typography>
            </Box>

            {/* Resolution Notes - Single Line */}
            {complaint.resolutionRequest?.notes && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontStyle: 'italic',
                }}
              >
                "{complaint.resolutionRequest.notes}"
              </Typography>
            )}
          </Box>

          {/* Arrow Icon */}
          <IconButton size="small" sx={{ alignSelf: 'center' }}>
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}

export default ReviewComplaintCardCompact;
