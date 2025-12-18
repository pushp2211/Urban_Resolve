import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import {
  COMPLAINT_STATUS,
  COMPLAINT_STATUS_ENUM,
} from '../../enum/ComplaintStatus';
import Avatar from '@mui/material/Avatar';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../../enum/roles';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import apiClient from '../api/axios';
import StaffListDialog from './StaffListDialog.jsx';
import { useLoading } from '../context/LoadingContext.jsx';
// import {theme }from '../theme.js';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';

// import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { triggerNotification } from '../../utils/notificationService.js';
import Snack from './Snack.jsx';

import { useTheme } from '@mui/material/styles';

import UserDetailsModal from './admin/UserDetailsModal.jsx';
import { SNACK_SEVERITY } from '../../enum/snackSeverity.js';

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

function DetailedComplaint({ complaint, onAssign, onClose }) {
  console.log(complaint);
  // console.log(theme);
  const theme = useTheme();
  const { user } = useAuth();
  const assignedTo = complaint?.assignedTo;
  const [listOpen, setListOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [eligibleListError, setEligibleError] = useState(false);

  const [staffAssignError, setStaffAssignError] = useState('');
  const [staffAssignLoading, setStaffAssignLoading] = useState(false);
  const [showSnack, setShowSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const [snackSeverity, setSnackSeverity] = useState(SNACK_SEVERITY.INFO);

  const { showLoading, hideLoading } = useLoading();
  const [selectedUser, setSelectedUser] = useState(null);

  const initialStatus = complaint.status;

  let defaultValidStatuses = [];
  if (initialStatus === COMPLAINT_STATUS.IN_PROGRESS) {
    defaultValidStatuses = [
      COMPLAINT_STATUS.IN_PROGRESS,
      COMPLAINT_STATUS.RESOLVED,
    ];
  } else if (initialStatus === COMPLAINT_STATUS.PENDING) {
    defaultValidStatuses = [
      COMPLAINT_STATUS.PENDING,
      COMPLAINT_STATUS.REJECTED,
    ];
  } else {
    defaultValidStatuses = [initialStatus];
  }

  const [validComplaintStatus, setValidComplaintStatus] =
    useState(defaultValidStatuses);

  const [statusError, setStatusError] = useState('');
  const [statusLoading, setStatusLoading] = useState(false); // for opening user profile
  const [userModalOpen, setUserModalOpen] = useState(false);

  const closeUserModal = () => {
    setUserModalOpen(false);
  };

  const [curComplaintStatus, setComplaintCurStatus] = useState(
    complaint.status
  );

  useEffect(() => {
    if (curComplaintStatus === COMPLAINT_STATUS.IN_PROGRESS) {
      setValidComplaintStatus([
        COMPLAINT_STATUS.IN_PROGRESS,
        COMPLAINT_STATUS.RESOLVED,
      ]);
    } else if (curComplaintStatus === COMPLAINT_STATUS.PENDING) {
      setValidComplaintStatus([
        COMPLAINT_STATUS.PENDING,
        COMPLAINT_STATUS.REJECTED,
      ]);
    } else {
      setValidComplaintStatus([curComplaintStatus]);
    }
  }, [curComplaintStatus]);

  // const handleChange = async (event) => {
  //   if (event.target.value == '') return;
  //   event.stopPropagation();
  //   const id = complaint._id;
  //   console.log(event.target.value);
  //   // const status = complaint.status;
  //   const newStatus = event.target.value;
  //   setStatusError('');
  //   setStatusLoading(true);
  //   try {
  //     const response = await apiClient.put(`/admin/updateStatus/${id}`, {
  //       status: newStatus,
  //     });
  //     if (response.status !== 200) {
  //       setStatusError('Encountered an error while updating the status');
  //       return;
  //     }
  //     // console.log(response);

  //     const upDatedComplaint = response?.data?.data;
  //     complaint.status = upDatedComplaint.status;
  //     setComplaintCurStatus(upDatedComplaint.status);
  //     onAssign(upDatedComplaint);
  //     setSnackMessage('Status updated successfully');
  //     setShowSnack(true);

  //     triggerNotification({
  //       recipient_id: complaint.submittedBy,
  //       message: `Your complaint (topic: ${complaint.title}) status has been changed to ${complaint.status}`,
  //       complaint_id: complaint._id,
  //     });
  //   } catch (error) {
  //     setStaffAssignError('Unable to update, please try again.');
  //     console.error('Error updating status:', error);
  //   } finally {
  //     setStatusLoading(false);
  //   }
  // };
  const navigate = useNavigate();
  const navigateToResolutionRequestPage = () => {
    const complaintId = complaint._id;
    if (!complaintId) {
      setSnackMessage('complaint Id not found');
      setSnackSeverity(SNACK_SEVERITY.ERROR)
      setShowSnack(true);
    }
    navigate(`/complaint/resolution-request/${complaintId}`);
  };

  const handleUserClick = async (userObj) => {
    if (user && user.role !== ROLES.ADMIN) {
      return;
    }
    if (userObj && userObj._id) {
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
        hideLoading();
      }
    }
  };

  // const getEligibleStaffList = async (event) => {
  //   setListOpen(true);
  //   event.stopPropagation();
  //   event.preventDefault();
  //   const adminId = user._id;
  //   setEligibleError('');
  //   setLoading(true);

  //   try {
  //     const complaintDistrict = complaint?.address?.district
  //     const response = await apiClient.get(`/admin/staffList?district=${complaintDistrict}`);
  //     if (response.status != 200) {
  //       setEligibleError('error while fetching try again', response.status);
  //       return;
  //     }
  //     let simplifiedArray = [];
  //     // console.log(response.data.data);
  //     if (response.data.data.length === 0) {
  //       setEligibleError(
  //         'no staff found in the district of the complaint address'
  //       );
  //     } else {
  //       simplifiedArray = response.data.data.map((item) => ({
  //         _id: item?._id,
  //         fullName: item?.fullName,
  //         profilePicture: item?.profilePicture,
  //       }));
  //       setStaffList(simplifiedArray);
  //     }
  //   } catch (error) {
  //     setEligibleError('error while retrieving the list, try again later');
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleSelectStaff = async (staff) => {
  //   const id = complaint._id;
  //   const staffId = staff._id;
  //   if (!id || !staffId) {
  //     setStaffAssignError('staff id not found');
  //     return;
  //   }

  //   setStaffAssignError('');
  //   setLoading(true);
  //   try {
  //     const response = await apiClient.put(`/admin/assignComplaint/${id}`, {
  //       staffId,
  //     });
  //     // console.log(Response);
  //     if (response.status != 200) {
  //       setStaffAssignError('unable to assign, try again');
  //       return;
  //     }
  //     // console.log(response);
  //     const updatedComplaint = response.data.data;
  //     complaint.status = updatedComplaint.status;
  //     onAssign(updatedComplaint);
  //     triggerNotification({
  //       recipient_id: staffId,
  //       message: `You have been assigned a complaint from locality ${updatedComplaint.address?.locality} (Topic: ${updatedComplaint.title}, Urgency: ${updatedComplaint.urgency})`,
  //       complaint_id: updatedComplaint._id,
  //     });
  //     triggerNotification({
  //       recipient_id: complaint.submittedBy,
  //       message: `Your complaint (topic: ${complaint.title}) has been cassigned to staff, we'll be happy to solve as soon as possible`,
  //       complaint_id: complaint._id,
  //     });
  //     setSnackMessage('complaint assigned successfully');
  //     setShowSnack(true);
  //     setListOpen(false);
  //     setLoading(false);
  //   } catch (error) {
  //     setSnackMessage('Unable to assign, please try again.');
  //     setShowSnack(true);
  //     setStaffAssignError('Unable to assign, please try again.');
  //     console.error('Error assigning staff:', error);
  //   } finally {
  //     setStaffAssignLoading(false);
  //   }
  // };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 3,
        alignItems: 'center',
        // justifyContent: 'space-between',
        // bgcolor:"red",
        flexDirection: {
          xs: 'column',
          sm: 'column',
          md:'row',
          lg: 'row',
        },
        // backdropFilter:"blur(20px)",
        width: {
          xs: '24rem',
          sm: '26rem',
          md: '47rem',
          lg: '60rem',
        },
        backgroundColor: 'background.paper',
        borderRadius: '2rem',
        paddingX: '1rem',
        paddingY: '1rem',
        maxHeight: '95svh',
        overflowY: 'scroll',
        overflowX: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          width: {
            xs: '22rem',
            sm: '24rem',
            md: '50%',
            lg: '50%',
            xl: '50%',
          },
          flexGrow:1
        }}
      >
        {/* Header Card */}
        <Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 0.8,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: 1.2,
                alignItems: 'center',
                cursor: user?.role === ROLES.ADMIN ? 'pointer' : 'default',
                flex: 1,
              }}
              onClick={() => {
                handleUserClick(complaint?.submittedBy);
              }}
            >
              <Avatar
                alt={complaint.submittedBy?.fullName}
                src={complaint.submittedBy?.profilePicture}
                sx={{ width: 32, height: 32 }}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1.2, fontSize: '0.875rem' }}>
                  {complaint.submittedBy?.fullName}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                  Reporter
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Chip
                label={complaint?.status}
                color={getStatusColor(complaint?.status)}
                size="small"
                sx={{ fontWeight: 600 }}
              />
              <Button
                onClick={onClose}
                size="small"
                sx={{
                  display: { lg: 'none' },
                  minWidth: 'auto',
                  px: 1,
                }}
              >
                ✕
              </Button>
            </Box>
          </Box>
          
          <Typography 
            variant="body1" 
            sx={{ 
              fontWeight: 500,
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: 0.3,
            }}
            color='warning'
          >
            {complaint.title}
          </Typography>
        </Box>

        {/* Image Card */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            paddingTop: '56.25%',
            overflow: 'hidden',
            borderRadius: 1.5,
            boxShadow: 2,
          }}
        >
          <Box
            component="img"
            src={complaint.photoUrl}
            alt={complaint.title}
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

        {/* Info Footer */}
        <Box
          sx={{
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
            padding: 1.2,
            borderRadius: 1.5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.2, fontSize: '0.7rem' }}>
              Submitted
            </Typography>
            <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.875rem' }}>
              {new Date(complaint.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.2, fontSize: '0.7rem' }}>
              Category
            </Typography>
            <Typography variant="body2" fontWeight={500} sx={{ textTransform: 'capitalize', fontSize: '0.875rem' }}>
              {complaint.type}
            </Typography>
          </Box>
        </Box>
      </Box>
      {/* Right Side Content */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          flexGrow: 1,
          gap: 1.5,
          width:{
            xs:"100%",
            sm:"100%",
            md:"50%",
            lg:"45%",
            xl:"45%"
          },
        }}
      >
        {/* Description Box */}
        <Box
          sx={{
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
            padding: 1.5,
            borderRadius: 1.5,
            borderLeft: '3px solid',
            borderColor: 'primary.main',
            maxHeight: '6rem',
            overflowY: 'auto',
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.3, mb: 0.5, display: 'block' }}>
            Description
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: 1.5, fontSize: '0.875rem',  }}>
            {complaint.description}
          </Typography>
        </Box>

        {/* Location Box */}
        <Box
          sx={{
            backgroundColor: theme.palette.mode === 'dark' ? '#3c4042' : '#f1f0fa',
            padding: 1.5,
            borderRadius: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.8 }}>
            {/* <Typography sx={{ fontSize: '0.9rem' }}>📍</Typography> */}
            <Typography variant="body2" fontWeight={600}>
              Location
            </Typography>
          </Box>
          <Typography variant="body2" fontWeight={500} sx={{ mb: 0.3, fontSize: '0.875rem' }}>
            {complaint.address?.locality || 'N/A'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {[
              complaint.address?.district,
              complaint.address?.state,
            ].filter(Boolean).join(', ')}
            {(complaint.address?.pinCode || complaint.address?.pincode) && 
              ` - ${complaint.address?.pinCode || complaint.address?.pincode}`}
          </Typography>
        </Box>

        {/* Assigned To Box */}
        <Box
          sx={{
            backgroundColor: theme.palette.mode === 'dark' ? '#3c4042' : '#f1f0fa',
            padding: 1.5,
            borderRadius: 1.5,
          }}
        >
          <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
            Assigned To
          </Typography>
          {complaint.assignedTo ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
                padding: 0.8,
                borderRadius: 1,
                transition: 'background-color 0.2s',
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                },
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleUserClick(complaint?.assignedTo);
              }}
            >
              <Avatar
                alt={complaint.assignedTo?.fullName}
                src={complaint.assignedTo?.profilePicture}
                sx={{ width: 32, height: 32 }}
              />
              <Typography variant="body2" fontWeight={500}>
                {complaint.assignedTo?.fullName}
              </Typography>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              Not assigned yet
            </Typography>
          )}
        </Box>

        {/* Admin Action Button */}
        {user?.role === ROLES?.ADMIN &&
          complaint?.status !== COMPLAINT_STATUS.REJECTED && (
            <Button
              onClick={() => navigate(`/admin/assign-complaint/${complaint?._id}`)}
              variant="contained"
              disabled={listOpen}
              fullWidth
              sx={{
                textTransform: 'none',
                py: 1.2,
                borderRadius: 1.5,
                fontWeight: 600,
                mt: 0.5,
              }}
            >
              Manage Complaint
            </Button>
          )}

        {/* Staff Resolution Button */}
        {user.role === ROLES.STAFF &&
          user._id === complaint?.assignedTo?._id && (
            <Box>
              <Button 
                onClick={navigateToResolutionRequestPage}
                variant="contained"
                color="success"
                fullWidth
                sx={{
                  textTransform: 'none',
                  py: 1.2,
                  borderRadius: 1.5,
                  fontWeight: 600,
                }}
              >
                Resolve Complaint
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, textAlign: 'center', px: 1 }}>
                Submit a resolution request to complete this complaint
              </Typography>
            </Box>
          )}
      </Box>

      {showSnack && <Snack openStatus={showSnack} message={snackMessage} severity={snackSeverity} setOpenStatus={setShowSnack}/>}
      {userModalOpen && (
        <UserDetailsModal
          open={userModalOpen}
          user={selectedUser}
          onClose={closeUserModal}
        />
      )}
    </Box>
  );
}

export default DetailedComplaint;
