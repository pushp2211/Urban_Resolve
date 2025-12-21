import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {Button} from '@mui/material';
import { Avatar, Container } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import InfoPieChart from '../components/InfoPieChart';
import apiClient from '../api/axios';
// import {theme} from '../theme';
// import useTheme from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { COMPLAINT_STATUS } from '../../enum/ComplaintStatus';
import EditProfile from '../components/EditProfile';
import { ROLES } from '../../enum/roles';
import { useLoading } from '../context/LoadingContext';
import Snack from '../components/Snack';
import { SNACK_SEVERITY } from '../../enum/snackSeverity';
function Profile() {
  const theme = useTheme();
  const { user } = useAuth();
  const [userComplaintDetails, setUserComplaintDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState([]);
  const [submittedData, setSubmittedData] = useState([]);


  const {showLoading, hideLoading} = useLoading();

  const [totalComplaints, setTotalComplaints] = useState(0);
  const [resolved, setResolved] = useState(0);
  const [inProgress, setInprogress] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [pending, setPending] = useState(0);
  const [pendingReview, setPendingReview] = useState(0);
  
  // For staff - separate stats
  const [assignedTotal, setAssignedTotal] = useState(0);
  const [assignedResolved, setAssignedResolved] = useState(0);
  const [assignedInProgress, setAssignedInProgress] = useState(0);
  const [assignedPendingReview, setAssignedPendingReview] = useState(0);
  
  const [submittedTotal, setSubmittedTotal] = useState(0);
  const [submittedResolved, setSubmittedResolved] = useState(0);
  const [submittedInProgress, setSubmittedInProgress] = useState(0);
  const [submittedPending, setSubmittedPending] = useState(0);
  const [submittedRejected, setSubmittedRejected] = useState(0);
  const [submittedPendingReview, setSubmittedPendingReview] = useState(0);

  const [editOpen, setEditOpen] = useState(false);

  const[snackMessage, setSnackMessage] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackSeverity, setSnackSeverity] = useState(SNACK_SEVERITY.INFO);

  const setEditOpenController = ()=>{
    setEditOpen(true);
  }
  const setEditCloseController = ()=>{
    setEditOpen(false);
  }

  const STATUS_COLORS = {
    Resolved: '#005f00', // Green
    Pending: '#e95101', // Orange
    'In Progress': '#3814d8', // Blue
    Rejected: '#c90000', // Red
    'Pending Review': '#f59e0b', // Amber
  };

  useEffect(() => {
    if (user.role === ROLES.STAFF) {
      // For staff, data contains assigned complaints for the chart
      let total = 0;
      data.forEach((element) => {
        total += element.value;
        if (element.label === COMPLAINT_STATUS.IN_PROGRESS)
          setAssignedInProgress(element.value);
        if (element.label === COMPLAINT_STATUS.RESOLVED)
          setAssignedResolved(element.value);
        if (element.label === COMPLAINT_STATUS.PENDING_REVIEW)
          setAssignedPendingReview(element.value);
      });
      setAssignedTotal(total);
    } else {
      // For USER/ADMIN, data contains submitted complaints
      let total = 0;
      data.forEach((element) => {
        total += element.value;
        if (element.label === COMPLAINT_STATUS.IN_PROGRESS)
          setInprogress(element.value);
        if (element.label === COMPLAINT_STATUS.PENDING) setPending(element.value);
        if (element.label === COMPLAINT_STATUS.REJECTED)
          setRejected(element.value);
        if (element.label === COMPLAINT_STATUS.RESOLVED)
          setResolved(element.value);
        if (element.label === COMPLAINT_STATUS.PENDING_REVIEW)
          setPendingReview(element.value);
      });
      setTotalComplaints(total);
    }
  }, [data, user.role]);

  useEffect(() => {

    const fetchInfo = async () => {
      setError('');
      setLoading(true);
      try {
        showLoading();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const response = await apiClient.get(`/profile`);
        if (response.status !== 200) {
          setError('Error occured while fetching the profile information');
          return;
        }
        // console.log(response.data.data);
        const complaintStats = response.data?.data?.complaintStats;
        // console.log(complaintStats);
        setUserComplaintDetails(complaintStats);

        // console.log(userComplaintDetails)
      } catch (error) {
        setError('Error while fetching profile information');
        console.log(error);
      } finally {
        hideLoading();
        setLoading(false);
      }
    };
    fetchInfo();
  }, [user]);

  useEffect(() => {
    let chartData = [];
    let submittedChartData = [];
    
    if (user.role === ROLES.STAFF && userComplaintDetails.assigned) {
      // For staff, show assigned complaints in the chart
      chartData = Object.keys(userComplaintDetails.assigned).map((key, index) => ({
        id: index,
        value: userComplaintDetails.assigned[key],
        label: key,
        color: STATUS_COLORS[key],
      })).filter(item => item.value > 0);
      
      // Calculate submitted totals and chart data for staff
      if (userComplaintDetails.submitted) {
        let submittedTotalCount = 0;
        submittedChartData = Object.keys(userComplaintDetails.submitted).map((key, index) => ({
          id: index,
          value: userComplaintDetails.submitted[key],
          label: key,
          color: STATUS_COLORS[key],
        })).filter(item => item.value > 0);
        
        Object.entries(userComplaintDetails.submitted).forEach(([status, count]) => {
          submittedTotalCount += count;
          if (status === COMPLAINT_STATUS.RESOLVED) setSubmittedResolved(count);
          if (status === COMPLAINT_STATUS.IN_PROGRESS) setSubmittedInProgress(count);
          if (status === COMPLAINT_STATUS.PENDING) setSubmittedPending(count);
          if (status === COMPLAINT_STATUS.REJECTED) setSubmittedRejected(count);
          if (status === COMPLAINT_STATUS.PENDING_REVIEW) setSubmittedPendingReview(count);
        });
        setSubmittedTotal(submittedTotalCount);
      }
    } else if (userComplaintDetails.submitted) {
      // For USER/ADMIN, show submitted complaints in the chart
      chartData = Object.keys(userComplaintDetails.submitted).map((key, index) => ({
        id: index,
        value: userComplaintDetails.submitted[key],
        label: key,
        color: STATUS_COLORS[key],
      })).filter(item => item.value > 0);
    }
    
    setData(chartData);
    setSubmittedData(submittedChartData);
  }, [userComplaintDetails, user.role]);

  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: '78svh',
        paddingY: {
          xs: 3,
          md: 4,
          lg: 5
        },
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'center', md: 'flex-start' },
          gap: 3,
          mb: 4,
          pb: 3,
          borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        }}
      >
        {/* Avatar & Basic Info */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2.5,
            alignItems: { xs: 'center', sm: 'flex-start' },
            flex: 1,
          }}
        >
          <Avatar
            alt={user.fullName}
            src={user.profilePicture}
            sx={{
              width: { xs: 100, md: 110 },
              height: { xs: 100, md: 110 },
              border: `3px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
            }}
          />
          
          <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                fontSize: { xs: '1.5rem', md: '2rem' },
                mb: 0.5,
              }}
            >
              {user.fullName}
            </Typography>
            
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1.5, fontSize: '0.875rem' }}
            >
              {user.email}
            </Typography>
            
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                px: 1.5,
                py: 0.5,
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                borderRadius: '20px',
                border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: 600 }}>
                Role
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                {user.role}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Edit Button */}
        <Button
          onClick={setEditOpenController}
          variant="outlined"
          sx={{
            borderRadius: '8px',
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 500,
            height: 'fit-content',
            borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
            '&:hover': {
              borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
            },
          }}
        >
          Edit Profile
        </Button>
      </Box>

      {/* Welcome Message */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            fontSize: { xs: '1.25rem', md: '1.5rem' },
            mb: 0.5,
          }}
        >
          Welcome back, {user.fullName?.split(' ')[0]}!
        </Typography>
        <Typography variant="body2" color="text.secondary">
          A cleaner, safer society starts with you
        </Typography>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          gap: 3,
        }}
      >
        {/* Left Column - Address & Chart */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            width: { xs: '100%', lg: '350px' },
          }}
        >
          {/* Address Details */}
          <Box
            sx={{
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
              borderRadius: '12px',
              p: 3,
              border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
            }}
          >
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: 1,
                display: 'block',
                mb: 2,
              }}
            >
              Address Details
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" sx={{ lineHeight: 1.6, fontWeight: 500 }}>
                {user?.address?.locality}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                {user?.address?.city}, {user?.address?.district}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                {user?.address?.state} - {user?.address?.pinCode}
              </Typography>
            </Box>
          </Box>

          {/* Pie Charts */}
          {user.role === ROLES.STAFF ? (
            <>
              {/* Assigned Complaints Chart */}
              {assignedTotal > 0 && (
                <Box
                  sx={{
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                    borderRadius: '12px',
                    p: 3,
                    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
                  }}
                >
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    sx={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      letterSpacing: 1,
                      display: 'block',
                      mb: 2,
                      textAlign: 'center',
                    }}
                  >
                    Assigned Complaints
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <InfoPieChart data={data} colors={STATUS_COLORS} />
                  </Box>
                </Box>
              )}
              
              {/* Submitted Complaints Chart */}
              {submittedTotal > 0 && (
                <Box
                  sx={{
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                    borderRadius: '12px',
                    p: 3,
                    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
                  }}
                >
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    sx={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      letterSpacing: 1,
                      display: 'block',
                      mb: 2,
                      textAlign: 'center',
                    }}
                  >
                    My Submitted Complaints
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <InfoPieChart data={submittedData} colors={STATUS_COLORS} />
                  </Box>
                </Box>
              )}
            </>
          ) : (
            totalComplaints > 0 && (
              <Box
                sx={{
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                  borderRadius: '12px',
                  p: 3,
                  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <InfoPieChart data={data} colors={STATUS_COLORS} />
              </Box>
            )
          )}
        </Box>

        {/* Right Column - Statistics */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          {/* Stats Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
              gap: 2,
            }}
          >
            {/* Total Complaints - Different for Staff */}
            {user.role === ROLES.STAFF ? (
              <>
                <Box
                  sx={{
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                    borderRadius: '12px',
                    p: 2.5,
                    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
                  }}
                >
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                    Total Complaints Assigned
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 600, mt: 0.5 }}>
                    {assignedTotal}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                    borderRadius: '12px',
                    p: 2.5,
                    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
                  }}
                >
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                    Total Complaints Submitted
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 600, mt: 0.5 }}>
                    {submittedTotal}
                  </Typography>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                  borderRadius: '12px',
                  p: 2.5,
                  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
                  gridColumn: 'span 2',
                }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                  Total Complaints Reported
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 600, mt: 0.5 }}>
                  {totalComplaints}
                </Typography>
              </Box>
            )}

            {/* Stats - Different layout for Staff vs USER/ADMIN */}
            {user.role === ROLES.STAFF ? (
              <>
                {/* Assigned Stats Section */}
                <Box sx={{ gridColumn: 'span 2', mb: 1 }}>
                  <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ mb: 1.5, textTransform: 'uppercase', fontSize: '0.75rem' }}>
                    📋 Assigned Complaints
                  </Typography>
                </Box>
                
                <Box sx={{ backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderRadius: '12px', p: 2.5, border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}` }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Resolved</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 600, mt: 0.5 }}>{assignedResolved}</Typography>
                </Box>
                
                <Box sx={{ backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderRadius: '12px', p: 2.5, border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}` }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>In Progress</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 600, mt: 0.5 }}>{assignedInProgress}</Typography>
                </Box>
                
                <Box sx={{ backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderRadius: '12px', p: 2.5, border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}` }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Pending Review</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 600, mt: 0.5 }}>{assignedPendingReview}</Typography>
                </Box>

                {/* Submitted Stats Section */}
                <Box sx={{ gridColumn: 'span 2', mt: 2, mb: 1 }}>
                  <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ mb: 1.5, textTransform: 'uppercase', fontSize: '0.75rem' }}>
                    📝 My Submitted Complaints
                  </Typography>
                </Box>
                
                <Box sx={{ backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderRadius: '12px', p: 2.5, border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}` }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Resolved</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 600, mt: 0.5 }}>{submittedResolved}</Typography>
                </Box>
                
                <Box sx={{ backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderRadius: '12px', p: 2.5, border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}` }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>In Progress</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 600, mt: 0.5 }}>{submittedInProgress}</Typography>
                </Box>
                
                <Box sx={{ backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderRadius: '12px', p: 2.5, border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}` }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Pending</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 600, mt: 0.5 }}>{submittedPending}</Typography>
                </Box>
                
                <Box sx={{ backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderRadius: '12px', p: 2.5, border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}` }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Rejected</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 600, mt: 0.5 }}>{submittedRejected}</Typography>
                </Box>
                
                <Box sx={{ backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderRadius: '12px', p: 2.5, border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}` }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Pending Review</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 600, mt: 0.5 }}>{submittedPendingReview}</Typography>
                </Box>
              </>
            ) : (
              <>
                {/* USER/ADMIN Stats */}
                <Box sx={{ backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderRadius: '12px', p: 2.5, border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}` }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Resolved</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 600, mt: 0.5 }}>{resolved}</Typography>
                </Box>
                
                <Box sx={{ backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderRadius: '12px', p: 2.5, border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}` }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>In Progress</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 600, mt: 0.5 }}>{inProgress}</Typography>
                </Box>
                
                <Box sx={{ backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderRadius: '12px', p: 2.5, border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}` }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Pending</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 600, mt: 0.5 }}>{pending}</Typography>
                </Box>
                
                <Box sx={{ backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderRadius: '12px', p: 2.5, border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}` }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Rejected</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 600, mt: 0.5 }}>{rejected}</Typography>
                </Box>
                
                <Box sx={{ backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderRadius: '12px', p: 2.5, border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}` }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Pending Review</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 600, mt: 0.5 }}>{pendingReview}</Typography>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Box>

      <EditProfile open={editOpen} onClose={setEditCloseController} setSnackMessage={setSnackMessage} snackOpen={snackOpen} setSnackOpen={setSnackOpen} snackMessage={snackMessage} snackSeverity={snackSeverity} setSnackSeverity={setSnackSeverity} />
      {snackOpen && <Snack message={snackMessage} openStatus={snackOpen} severity={snackSeverity} setOpenStatus={setSnackOpen} />}
    </Container>
  );
}

export default Profile;
