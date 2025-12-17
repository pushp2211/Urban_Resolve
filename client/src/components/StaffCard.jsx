import React, {useState} from 'react';
import {
  Card,
  CardContent,
  Box,
  Avatar,
  Typography,
  Chip,
  Button,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ConfirmDialog from './common/ConfirmDialog';
function StaffCard({ staff, onViewDetails, onAssign, assigning }) {
  const getWorkloadColor = (total) => {
    if (total === 0) return 'success';
    if (total <= 5) return 'primary';
    if (total <= 10) return 'warning';
    return 'error';
  };

  const getWorkloadLabel = (total) => {
    if (total === 0) return 'Available';
    if (total <= 5) return 'Light Load';
    if (total <= 10) return 'Moderate';
    return 'Heavy Load';
  };

  const [openConfirmBox, setOpenConfirmBox] = useState(false);



  const handleAssign = ()=>{
    setOpenConfirmBox(true);
  }

  const onConfirmBoxClose = ()=>{
    setOpenConfirmBox(false);
  }

  const onAssignConfirm = ()=>{
    onAssign();
  }

  const confirmDialogBox = {
    'title' : "Assign Complaint",
    'message' : `Assign this complaint to ${staff.fullName}`
  }
  return (
    <Card
      sx={{
        width: '100%',
        cursor: 'pointer',
        transition: 'all 0.2s',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: 'none',
        borderRadius: 2,
        boxSizing: 'border-box',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: 1,
        },
      }}
      onClick={onViewDetails}
    >
      <CardContent sx={{ p: { xs: 2, sm: 2.5 }, display: 'flex', alignItems: 'center', gap: 2, '&:last-child': { pb: { xs: 2, sm: 2.5 } } }}>
        {/* Avatar */}
        <Avatar
          src={staff.avatar || staff.profilePicture}
          alt={staff.fullName}
          sx={{ width: 52, height: 52, flexShrink: 0 }}
        >
          {staff.fullName?.[0]?.toUpperCase()}
        </Avatar>

        {/* Info Section */}
        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {staff.fullName}
            </Typography>
            <Chip
              label={getWorkloadLabel(staff.complaintStats.total)}
              color={getWorkloadColor(staff.complaintStats.total)}
              size="small"
              sx={{ fontWeight: 600, fontSize: '0.7rem', height: 22 }}
            />
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <EmailIcon sx={{ fontSize: 14 }} />
            {staff.email}
          </Typography>

          {/* Stats Row */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AssignmentIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                Assigned: <Box component="span" sx={{ fontWeight: 700 }}>{staff.complaintStats.total}</Box>
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
              <Typography variant="caption" color="text.secondary">
                Resolved: <Box component="span" sx={{ fontWeight: 700, color: 'success.main' }}>{staff.complaintStats.resolved}</Box>
              </Typography>
            </Box>

            {staff.complaintStats.avgResolutionTime !== null && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  Avg: <Box component="span" sx={{ fontWeight: 700 }}>{staff.complaintStats.avgResolutionTime} days</Box>
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Action Button */}
        <Button
          variant="contained"
          disabled={assigning}
          onClick={(e) => {
            e.stopPropagation();
            handleAssign();
          }}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            py: 1,
            flexShrink: 0,
          }}
        >
          Assign
        </Button>
      </CardContent>
      <ConfirmDialog
        open={openConfirmBox}
        onClose={onConfirmBoxClose}
        onConfirm={onAssignConfirm}
        message={confirmDialogBox.message}
        title={confirmDialogBox.title}
      />
    </Card>
  );
}

export default StaffCard;
