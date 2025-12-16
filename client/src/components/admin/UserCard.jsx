import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  Avatar,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

function UserCard({ user, onClick }) {
  const theme = useTheme();

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'staff':
        return 'primary';
      case 'user':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Card
      sx={{
        marginBottom: 2,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
        },
      }}
      onClick={onClick}
    >
      <CardContent sx={{ paddingY: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {/* Avatar */}
          <Avatar
            src={user.avatar || user.profilePicture}
            alt={user.fullName}
            sx={{ width: 56, height: 56 }}
          >
            {user.fullName?.[0]?.toUpperCase()}
          </Avatar>

          {/* Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Name and Role */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                marginBottom: 0.5,
                flexWrap: 'wrap',
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={600}
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user.fullName}
              </Typography>
              <Chip
                label={user.role}
                color={getRoleColor(user.role)}
                size="small"
                sx={{ textTransform: 'capitalize' }}
              />
            </Box>

            {/* Email */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, marginBottom: 0.5 }}>
              <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary" noWrap>
                {user.email}
              </Typography>
            </Box>

            {/* Phone */}
            {user.phoneNumber && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, marginBottom: 0.5 }}>
                <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary" noWrap>
                  {user.phoneNumber}
                </Typography>
              </Box>
            )}

            {/* Location */}
            {user.address && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary" noWrap>
                  {user.address.city}, {user.address.state}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default UserCard;
