import { Box, Container, Button, Card, CardContent } from '@mui/material';
import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import GroupIcon from '@mui/icons-material/Group';
import GavelIcon from '@mui/icons-material/Gavel';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import apiClient from '../api/axios';
import { useLoading } from '../context/LoadingContext';
import { COMPLAINT_STATUS } from '../../enum/ComplaintStatus';

function Management() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  
  const [userStats, setUserStats] = useState(null);
  const [complaintStats, setComplaintStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        showLoading();
        const [userResponse, complaintResponse] = await Promise.all([
          apiClient.get('/service/user/stats'),
          apiClient.get('/service/complaint/stats')
        ]);
        
        setUserStats(userResponse.data.data);
        setComplaintStats(complaintResponse.data.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        hideLoading();
      }
    };

    fetchStats();
  }, []);

  const handleManageUsers = () => {
    navigate('/management/users');
  };

  const handleReviewRequests = () => {
    navigate('/management/resolutions');
  };

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        paddingY: 4,
        minHeight: '78svh',
      }}
    >
      {/* User Stats Section */}
      <Box>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          User Statistics
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(3, 1fr)',
            },
            gap: 2,
            marginTop: 2
          }}
        >
          <Card
            sx={{
              backgroundColor: theme.palette.mode === 'dark' ? '#3c4042' : '#f1f0fa',
            }}
          >
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Total Users Registered
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {userStats?.total || 0}
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              backgroundColor: theme.palette.mode === 'dark' ? '#3c4042' : '#f1f0fa',
            }}
          >
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Staff
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {userStats?.staffs || 0}
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              backgroundColor: theme.palette.mode === 'dark' ? '#3c4042' : '#f1f0fa',
            }}
          >
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Admins
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {userStats?.admins || 0}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Complaint Stats Section */}
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          Complaint Statistics
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(3, 1fr)',
              md: 'repeat(6, 1fr)',
            },
            gap: 2,
            marginTop: 2
          }}
        >
          <Card
            sx={{
              backgroundColor: theme.palette.mode === 'dark' ? '#3c4042' : '#f1f0fa',
            }}
          >
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Total Complaints
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {complaintStats?.total || 0}
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              backgroundColor: theme.palette.mode === 'dark' ? '#3c4042' : '#fff3e0',
            }}
          >
            <CardContent>
              <Typography variant="overline" sx={{ color: '#ed6c02' }}>
                {COMPLAINT_STATUS.PENDING}
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#ed6c02' }}>
                {complaintStats?.pending || 0}
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              backgroundColor: theme.palette.mode === 'dark' ? '#3c4042' : '#e3f2fd',
            }}
          >
            <CardContent>
              <Typography variant="overline" sx={{ color: '#0288d1' }}>
                {COMPLAINT_STATUS.IN_PROGRESS}
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#0288d1' }}>
                {complaintStats?.inProgress || 0}
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              backgroundColor: theme.palette.mode === 'dark' ? '#3c4042' : '#e8f5e9',
            }}
          >
            <CardContent>
              <Typography variant="overline" sx={{ color: '#2e7d32' }}>
                {COMPLAINT_STATUS.RESOLVED}
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#2e7d32' }}>
                {complaintStats?.resolved || 0}
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              backgroundColor: theme.palette.mode === 'dark' ? '#3c4042' : '#ffebee',
            }}
          >
            <CardContent>
              <Typography variant="overline" sx={{ color: '#c62828' }}>
                {COMPLAINT_STATUS.REJECTED}
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#c62828' }}>
                {complaintStats?.rejected || 0}
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              backgroundColor: theme.palette.mode === 'dark' ? '#3c4042' : '#fff8e1',
            }}
          >
            <CardContent>
              <Typography variant="overline" sx={{ color: '#f57c00' }}>
                {COMPLAINT_STATUS.PENDING_REVIEW}
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#f57c00' }}>
                {complaintStats?.pendingReview || 0}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Actions Section */}
      <Box>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, marginBottom: 2 }}>
          Quick Actions
        </Typography>
        
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr',
              md: 'repeat(2, 1fr)',
            },
            gap: 3,
          }}
        >
          {/* Manage Users Card */}
          <Card
            sx={{
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4,
              },
            }}
          >
            <CardContent sx={{ padding: 4 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  marginBottom: 2,
                }}
              >
                <GroupIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Manage Users
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 3 }}>
                View and manage all registered users, staff members, and admins
              </Typography>

              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={handleManageUsers}
                fullWidth
                sx={{
                  paddingY: 1.5,
                  fontWeight: 600,
                }}
              >
                View All Users
              </Button>
            </CardContent>
          </Card>

          {/* Resolution Center Card */}
          <Card
            sx={{
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4,
              },
            }}
          >
            <CardContent sx={{ padding: 4 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  marginBottom: 2,
                }}
              >
                <GavelIcon sx={{ fontSize: 40, color: theme.palette.success.main }} />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Resolution Center
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 3 }}>
                Review and approve resolution requests submitted by staff members
              </Typography>

              <Button
                variant="contained"
                color="success"
                endIcon={<ArrowForwardIcon />}
                onClick={handleReviewRequests}
                fullWidth
                sx={{
                  paddingY: 1.5,
                  fontWeight: 600,
                }}
              >
                Review Requests
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
}

export default Management;
