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
        marginBottom: 1,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
        },
      }}
      onClick={onViewDetails}
    >
      <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
        <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'center' }}>
          {/* Avatar */}
          <Avatar
            src={staff.avatar || staff.profilePicture}
            alt={staff.fullName}
            sx={{ width: 40, height: 40, flexShrink: 0 }}
          >
            {staff.fullName?.[0]?.toUpperCase()}
          </Avatar>

          {/* Content */}
          <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0.2 }}>
            {/* Name and Workload */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
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
                  flex: '0 1 auto',
                }}
              >
                {staff.fullName}
              </Typography>
              <Chip
                label={getWorkloadLabel(staff.complaintStats.total)}
                color={getWorkloadColor(staff.complaintStats.total)}
                size="small"
                sx={{ fontWeight: 600, height: 22 }}
              />
            </Box>

            {/* Email */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minHeight: 18 }}>
              <EmailIcon sx={{ fontSize: 16, color: 'text.secondary', flexShrink: 0 }} />
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {staff.email}
              </Typography>
            </Box>

            {/* Stats Row */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mt: 0.2 }}>
              {/* Total Assigned */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AssignmentIcon sx={{ fontSize: 16, color: 'text.secondary', flexShrink: 0 }} />
                <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                  Total Assigned: <Box component="span" sx={{ fontWeight: 700 }}>{staff.complaintStats.total}</Box>
                </Typography>
              </Box>

              {/* Avg Resolution */}
              {staff.complaintStats.avgResolutionTime !== null && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary', flexShrink: 0 }} />
                  <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                    Avg Resolution: <Box component="span" sx={{ fontWeight: 700 }}>{staff.complaintStats.avgResolutionTime} days</Box>
                  </Typography>
                </Box>
              )}

              {/* Resolved */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main', flexShrink: 0 }} />
                <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                  Resolved: <Box component="span" sx={{ fontWeight: 700, color: 'success.main' }}>{staff.complaintStats.resolved}</Box>
                </Typography>
              </Box>
            </Box>

            {/* Action Button */}
            <Box sx={{ mt: 0.5 }}>
              <Button
                variant="contained"
                size="small"
                fullWidth
                disabled={assigning}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAssign()
                }}
                sx={{ 
                  textTransform: 'none', 
                  fontSize: '0.75rem',
                  paddingY: 0.4,
                  minHeight: 28,
                }}
              >
                Assign
              </Button>
            </Box>
          </Box>
        </Box>
      </CardContent>
      <ConfirmDialog open={openConfirmBox} onClose={onConfirmBoxClose} onConfirm={onAssignConfirm} message={confirmDialogBox.message} title={confirmDialogBox.title}/>
    </Card>
  );
}

export default StaffCard;
