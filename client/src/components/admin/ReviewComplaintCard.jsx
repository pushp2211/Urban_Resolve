import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  Button,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ReviewPhotoGallery from './ReviewPhotoGallery';
import apiClient from '../../api/axios';

function ReviewComplaintCard({ complaint, onReviewed }) {
  const theme = useTheme();
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleApprove = async () => {
    if (!window.confirm('Are you sure you want to approve this resolution?')) {
      return;
    }

    setLoading(true);
    setError('');
    try {
      await apiClient.patch(
        `/admin/complaints/${complaint._id}/review-resolution`,
        { approved: true }
      );
      alert('Complaint marked as resolved!');
      onReviewed();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to approve resolution');
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
      setShowRejectDialog(false);
      setRejectionReason('');
      onReviewed();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to reject resolution');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card
        sx={{
          marginBottom: 3,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <CardContent>
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 2,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                {complaint.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', marginTop: 1 }}>
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
          <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar src={complaint.submittedBy?.avatar} sx={{ width: 32, height: 32 }}>
                {complaint.submittedBy?.fullName?.[0]}
              </Avatar>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Submitted by
                </Typography>
                <Typography variant="body2">
                  {complaint.submittedBy?.fullName}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>
                {complaint.assignedTo?.fullName?.[0]}
              </Avatar>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Assigned to
                </Typography>
                <Typography variant="body2">
                  {complaint.assignedTo?.fullName}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Location */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 2 }}>
            <LocationOnIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {complaint.address.city}, {complaint.address.state} - {complaint.address.pinCode}
            </Typography>
          </Box>

          <Divider sx={{ marginY: 2 }} />

          {/* Resolution Notes */}
          {complaint.resolutionRequest?.notes && (
            <Box sx={{ marginBottom: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Resolution Notes:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {complaint.resolutionRequest.notes}
              </Typography>
            </Box>
          )}

          {/* Resolution Photos */}
          <ReviewPhotoGallery photos={complaint.resolutionRequest?.photos} />

          {/* Submission Date */}
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', marginTop: 2 }}>
            Submitted for review:{' '}
            {new Date(complaint.resolutionRequest?.submittedAt).toLocaleString('en-IN')}
          </Typography>

          <Divider sx={{ marginY: 2 }} />

          {/* Action Buttons */}
          {error && (
            <Alert severity="error" sx={{ marginBottom: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircleIcon />}
              onClick={handleApprove}
              disabled={loading}
              fullWidth
            >
              Approve & Mark as Resolved
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<CancelIcon />}
              onClick={() => setShowRejectDialog(true)}
              disabled={loading}
              fullWidth
            >
              Reject
            </Button>
          </Box>
        </CardContent>
      </Card>

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
    </>
  );
}

export default ReviewComplaintCard;
