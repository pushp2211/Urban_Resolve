import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  Chip,
  Avatar,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ReviewPhotoGallery from './ReviewPhotoGallery';
import OriginalComplaintDetails from './OriginalComplaintDetails';
import ConfirmDialog from '../common/ConfirmDialog';
import apiClient from '../../api/axios';
import { triggerNotification } from '../../../utils/notificationService';
import UserDetailsModal from './UserDetailsModal';
import { useLoading } from '../../context/LoadingContext';
function ReviewDetailsSidebar({ open, complaint, onClose, onReviewed }) {
  const theme = useTheme();
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userProfileOpen, setUserProfileOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userLoading, setUserLoading] = useState(false);

  const {showLoading, hideLoading} = useLoading();
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

  const openProfile = async (email) => {
    if (!email) return;
    setUserLoading(true);
    showLoading();
    try {
      const response = await apiClient.get('/admin/user', {
        params: { email }
      });
      setSelectedUser(response.data.data);
      setUserProfileOpen(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setUserLoading(false);
      hideLoading();
    }
  }

  const closeProfile = () => {
    setUserProfileOpen(false);
    setSelectedUser(null);
  }

  const handleApprove = async () => {
    setLoading(true);
    setError('');
    try {
      await apiClient.patch(
        `/admin/complaints/${complaint._id}/review-resolution`,
        { approved: true }
      );
      await triggerNotification({
        recipient_id: complaint.assignedTo._id,
        message: `Your complaint with topic "${complaint?.title}" has been marked as resolved.`,
        complaint_id: complaint._id
      });
      setShowApproveDialog(false);
      onReviewed();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to approve resolution');
      setShowApproveDialog(false);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await apiClient.patch(
        `/admin/complaints/${complaint._id}/review-resolution`,
        {
          approved: false,
          rejectionReason: rejectionReason.trim(),
        }
      );
      alert('Resolution request rejected');
      await triggerNotification({
        recipient_id: complaint.assignedTo._id,
        message: `Your resolution request for the complaint with topic "${complaint?.title}" has been rejected.`,
        complaint_id: complaint._id
      });
      setShowRejectDialog(false);
      setRejectionReason('');
      onReviewed();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to reject resolution');
    } finally {
      setLoading(false);
    }
  };

  if (!complaint) return null;

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        slotProps={{
          paper: {
            sx: {
              width: { xs: '100%', sm: '90%', md: 600 },
              padding: 0,
            },
          },
        }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: theme.palette.background.default }}>
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 3,
              py: 2.5,
              borderBottom: `1px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.background.paper,
            }}
          >
            <Typography variant="h5" fontWeight={600} letterSpacing={-0.5}>
              Review Resolution Request
            </Typography>
            <IconButton onClick={onClose} size="small" sx={{ ml: 2 }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Scrollable Content */}
          <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 3 }}>
            {/* Original Complaint Section */}
            <Box
              sx={{
                bgcolor: theme.palette.background.paper,
                p: 3,
                borderRadius: 2,
                mb: 3,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 1px 3px rgba(0,0,0,0.06)',
              }}
            >
              <Typography
                variant="caption"
                sx={{ 
                  fontWeight: 700, 
                  color: theme.palette.text.secondary, 
                  display: 'block', 
                  mb: 2,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  fontSize: '0.7rem'
                }}
              >
                Original Complaint
              </Typography>
              <OriginalComplaintDetails complaint={complaint} onUserClick={openProfile} />
            </Box>

            {/* Resolution Request Section */}
            <Box
              sx={{
                bgcolor: theme.palette.background.paper,
                p: 3,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 1px 3px rgba(0,0,0,0.06)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <CheckCircleIcon sx={{ fontSize: 22, color: theme.palette.text.primary }} />
                <Typography variant="h6" fontWeight={600} letterSpacing={-0.3}>
                  Resolution Request
                </Typography>
              </Box>

              {/* Staff Info */}
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 1.5,
                  mb: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                }}
              >
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  sx={{ display: 'block', mb: 1.5, fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.5 }}
                >
                  Submitted by
                </Typography>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    cursor: 'pointer',
                    borderRadius: 1,
                    p: 1,
                    mx: -1,
                    transition: 'background-color 0.2s',
                    '&:hover': {
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                    }
                  }}
                  onClick={() => openProfile(complaint?.assignedTo?.email)}
                >
                  <Avatar sx={{ width: 44, height: 44, bgcolor: theme.palette.primary.main, fontWeight: 600 }}>
                    {complaint.assignedTo?.fullName?.[0]}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body1" fontWeight={600} sx={{ mb: 0.25 }}>
                      {complaint.assignedTo?.fullName}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        fontSize: '0.875rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        wordBreak: 'break-all',
                      }}
                    >
                      {complaint.assignedTo?.email}
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 1.5 }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  {new Date(complaint.resolutionRequest?.submittedAt).toLocaleString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
              </Box>

              {/* Resolution Notes */}
              {complaint.resolutionRequest?.notes && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5, fontSize: '0.875rem' }}>
                    Resolution Note
                  </Typography>
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: 1.5,
                      border: `1px solid ${theme.palette.divider}`,
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        lineHeight: 1.7,
                        color: theme.palette.text.primary,
                      }}
                    >
                      {complaint.resolutionRequest.notes}
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Resolution Photos */}
              <Box>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5, fontSize: '0.875rem' }}>
                  Resolution Evidence
                </Typography>
                <ReviewPhotoGallery photos={complaint.resolutionRequest?.photos} />
              </Box>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}
          </Box>

          {/* Action Buttons - Fixed at Bottom */}
          <Box
            sx={{
              p: 3,
              borderTop: `1px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.background.paper,
              boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 -2px 8px rgba(0,0,0,0.05)',
            }}
          >
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircleIcon />}
                onClick={() => setShowApproveDialog(true)}
                disabled={loading}
                fullWidth
                sx={{ 
                  py: 1.25,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '0.9375rem',
                  boxShadow: 2,
                  '&:hover': { boxShadow: 4 }
                }}
              >
                Approve & Mark as Resolved
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<CancelIcon />}
                onClick={() => setShowRejectDialog(true)}
                disabled={loading}
                sx={{ 
                  py: 1.25,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '0.9375rem',
                  minWidth: 120,
                  borderWidth: 1.5,
                  '&:hover': { borderWidth: 1.5 }
                }}
              >
                Reject
              </Button>
            </Box>
          </Box>
        </Box>
      </Drawer>

      {/* Approve Confirmation Dialog */}
      <ConfirmDialog
        open={showApproveDialog}
        onClose={() => !loading && setShowApproveDialog(false)}
        onConfirm={handleApprove}
        title="Approve Resolution"
        message="Are you sure you want to approve this resolution request? This will mark the complaint as resolved."
        confirmText="Approve"
        confirmColor="success"
        loading={loading}
      />

      {/* Rejection Dialog */}
      <Dialog
        open={showRejectDialog}
        onClose={() => !loading && setShowRejectDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reject Resolution Request</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
            Please provide a reason for rejecting this resolution request. The staff member
            will be able to see this reason.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Rejection Reason *"
            value={rejectionReason}
            onChange={(e) => {
              setRejectionReason(e.target.value);
              setError('');
            }}
            placeholder="e.g., Photos are unclear, work seems incomplete..."
            error={!!error}
            helperText={error}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRejectDialog(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleReject}
            variant="contained"
            color="error"
            disabled={loading || !rejectionReason.trim()}
          >
            {loading ? 'Rejecting...' : 'Confirm Rejection'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* User Details Modal */}
      {selectedUser && (
        <UserDetailsModal
          open={userProfileOpen}
          onClose={closeProfile}
          user={selectedUser}
        />
      )}
    </>
  );
}

export default ReviewDetailsSidebar;
