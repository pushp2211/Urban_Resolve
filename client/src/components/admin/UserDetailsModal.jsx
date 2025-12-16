import React, { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  IconButton,
  Divider,
  Card,
  CardContent,
  Alert,
  Modal,
  Grow,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ROLES } from '../../../enum/roles';
import apiClient from '../../api/axios';

function UserDetailsModal({ open, user, onClose, onUserUpdate }) {
  const [selectedRole, setSelectedRole] = useState(user?.role || '');
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  if (!user) return null;

  const getRoleColor = (role) => {
    switch (role) {
      case ROLES.ADMIN :
        return 'error';
      case ROLES.STAFF :
        return 'primary';
      case ROLES.USER :
        return 'success';
      default:
        return 'default';
    }
  };

  const handleRoleChange = async () => {
    if (selectedRole === user?.role) {
      return;
    }

    setUpdating(true);
    setError('');

    try {
      const response = await apiClient.patch(`/admin/updateRole/${user._id}`, {
        role: selectedRole,
      });

      if (response.status === 200) {
        onUserUpdate({ ...user, role: selectedRole });
        // onClose();
        user.role = selectedRole;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user role');
    } finally {
      setUpdating(false);
    }
  };

  // Prepare chart data for staff
  const chartData = user.complaintStats
    ? [
        {
          name: 'Resolved',
          value: user.complaintStats.resolved,
          color: '#4caf50',
        },
        {
          name: 'In Progress',
          value: user.complaintStats.inProgress,
          color: '#2196f3',
        },
        {
          name: 'Pending',
          value: user.complaintStats.pending,
          color: '#ff9800',
        },
        {
          name: 'Rejected',
          value: user.complaintStats.rejected,
          color: '#f44336',
        },
        {
          name: 'Pending Review',
          value: user.complaintStats.pendingReview,
          color: '#9c27b0',
        },
      ].filter((item) => item.value > 0)
    : [];

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <AdminPanelSettingsIcon />;
      case 'staff':
        return <AssignmentIndIcon />;
      default:
        return <PersonIcon />;
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(2px)',
        backgroundColor: 'rgba(0,0,0,0.3)',
      }}
    >
      <Grow  in = {open} timeout={300}>
        <Box
        sx={{
          width: '90%',
          maxWidth: 1000,
          maxHeight: '90vh',
          overflow: 'auto',
          backgroundColor: 'background.paper',
          borderRadius: 5,
          boxShadow: 24,
          position: 'relative',
          outline: 'none',
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            zIndex: 1,
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Header Section with Avatar */}
        {/* <Box
          sx={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
            padding: 2.5,
            paddingTop: 4,
            textAlign: 'center',
          }}
        >
          <Avatar
            src={user.avatar || user.profilePicture}
            alt={user.fullName}
            sx={{
              width: 80,
              height: 80,
              margin: '0 auto 12px',
              border: '3px solid white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            {user.fullName?.[0]?.toUpperCase()}
          </Avatar>

          <Typography variant="h5" fontWeight={600} gutterBottom>
            {user.fullName}
          </Typography>

          <Chip
            icon={getRoleIcon(user.role)}
            label={user.role}
            color={getRoleColor(user.role)}
            size="small"
            sx={{
              textTransform: 'capitalize',
              fontWeight: 600,
            }}
          />
        </Box> */}

        {/* Content Section */}
        <Box sx={{ padding: 2.5 }}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  background:
                    'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
                  padding: 2.5,
                  paddingTop: 4,
                  textAlign: 'center',
                  height:"100%",
                  borderRadius:2,
                  width:{
                      xs:"80svw",
                      sm:"30rem",
                      md:"18rem"
                  },
                  display:"flex",
                  flexDirection:"column",
                  alignItems:"center",
                  justifyContent:"center"
                }}
              >
                <Avatar
                  src={user.avatar || user.profilePicture}
                  alt={user.fullName}
                  sx={{
                    width: 80,
                    height: 80,
                    margin: '0 auto 12px',
                    border: '3px solid white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                >
                  {user.fullName?.[0]?.toUpperCase()}
                </Avatar>

                <Typography variant="h5" fontWeight={600} gutterBottom>
                  {user.fullName}
                </Typography>

                <Chip
                  icon={getRoleIcon(user.role)}
                  label={user?.role || "User"}
                  color={getRoleColor(user.role)}
                  size="small"
                  sx={{
                    textTransform: 'capitalize',
                    fontWeight: 600,
                  }}
                />
              </Box>
            </Grid>
            {/* Contact Information Card */}
            <Grid item xs={12} md={5}>
              <Card elevation={1} sx={{ borderRadius: 2, height: '100%',
                width:{
                      xs:"80svw",
                      sm:"30rem",
                      md:"19rem"
                    }
               }}>
                <Box
                  sx={{
                    padding: 1.5,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    backgroundColor: 'rgba(99, 102, 241, 0.05)',
                    // maxWidth:"15rem"
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    Contact Information
                  </Typography>
                </Box>
                <CardContent sx={{ padding: 2 }}>
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}
                  >
                    <Box
                      sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
                    >
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          backgroundColor: 'primary.light',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <EmailIcon
                          sx={{ color: 'primary.main', fontSize: 16 }}
                        />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0,  }}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          Email Address
                        </Typography>
                        <Typography variant="body2" fontWeight={500} sx={{overflow:"scroll"}}>
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>

                    {user.phoneNumber && (
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
                      >
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            backgroundColor: 'success.light',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <PhoneIcon
                            sx={{ color: 'success.main', fontSize: 16 }}
                          />
                        </Box>
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                          >
                            Phone Number
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {user.phoneNumber}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {user.address && (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 1.5,
                        }}
                      >
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            backgroundColor: 'error.light',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <LocationOnIcon
                            sx={{ color: 'error.main', fontSize: 16 }}
                          />
                        </Box>
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                          >
                            Address
                          </Typography>
                          <Typography variant="body2" fontWeight={500} sx={{textTransform: 'capitalize',}}>
                            {user.address.locality}, {user.address.city}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            fontSize="0.8rem"

                          >
                            {user.address.district}, {user.address.state} -{' '}
                            {user.address.pinCode}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Role Management Card */}
            <Grid item xs={12} md={5}>
              <Card elevation={1} sx={{ borderRadius: 2, height: '100%',
                width:{
                      xs:"80svw",
                      sm:"30rem",
                      md:"19rem"
                    }
               }}>
                <Box
                  sx={{
                    padding: 1.5,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    backgroundColor: 'rgba(168, 85, 247, 0.05)',
                    
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    Role Management
                  </Typography>
                </Box>
                <CardContent sx={{ padding: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ marginBottom: 1.5 }}
                  >
                    Modify user permissions by changing their role
                  </Typography>

                  <FormControl
                    fullWidth
                    size="small"
                    sx={{ marginBottom: 1.5 }}
                  >
                    <InputLabel>Select Role</InputLabel>
                    <Select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      label="Select Role"
                    >
                      <MenuItem value={ROLES.USER}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                          }}
                        >
                          <PersonIcon fontSize="small" color="action" />
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              User
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Basic access
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                      <MenuItem value={ROLES.STAFF}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                          }}
                        >
                          <AssignmentIndIcon fontSize="small" color="primary" />
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              Staff
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Handle complaints
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                      <MenuItem value={ROLES.ADMIN}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                          }}
                        >
                          <AdminPanelSettingsIcon
                            fontSize="small"
                            color="error"
                          />
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              Admin
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Full control
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>

                  {error && (
                    <Alert severity="error" sx={{ marginBottom: 1.5 }}>
                      {error}
                    </Alert>
                  )}

                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Button onClick={onClose} variant="outlined" fullWidth>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleRoleChange}
                      variant="contained"
                      fullWidth
                      disabled={updating || selectedRole === user.role}
                    >
                      {updating ? 'Updating...' : 'Update Role'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Complaint Stats Section - Only for Staff */}
            {user.role === ROLES.STAFF && user.complaintStats && (
              <Grid item xs={12}>
                <Card elevation={1} sx={{ 
                  borderRadius: 2,
                  marginX:{
                    xs:0,
                    sm:1,
                    md:2
                  }

                }}>
                  <Box
                    sx={{
                      padding: 1.0,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      backgroundColor: 'rgba(34, 197, 94, 0.05)',
                      
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      Performance Statistics
                    </Typography>
                  </Box>
                  <CardContent sx={{ paddingX: 4 }}>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      {/* Total Assigned Card */}
                      <Paper
                        elevation={0}
                        sx={{
                          padding: 2,
                          borderRadius: 2,
                          backgroundColor: 'primary.main',
                          color: 'white',
                          textAlign: 'center',
                          minWidth: 140,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width:{
                            xs:"100%",
                            sm:""
                          }
                        }}
                      >
                        <Typography variant="caption" sx={{ opacity: 1 }}>
                          Total Assigned
                        </Typography>
                        <Typography variant="h3" fontWeight={700}>
                          {user.complaintStats.total}
                        </Typography>
                      </Paper>

                      {/* Stats Details */}
                      <Box
                        sx={{
                          flex: 1,
                          minWidth: 200,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Grid container spacing={1}>
                          {[
                            {
                              label: 'Resolved',
                              value: user.complaintStats.resolved,
                              color: 'success.main',
                            },
                            {
                              label: 'In Progress',
                              value: user.complaintStats.inProgress,
                              color: 'primary.main',
                            },
                            {
                              label: 'Pending',
                              value: user.complaintStats.pending,
                              color: 'warning.main',
                            },
                            {
                              label: 'Pending Review',
                              value: user.complaintStats.pendingReview,
                              color: '#9c27b0',
                            },
                            {
                              label: 'Rejected',
                              value: user.complaintStats.rejected,
                              color: 'error.main',
                            },
                            {
                              label: 'Avg Resolution time',
                              value: user.complaintStats.avgResolutionTime !== null 
                                ? `${user.complaintStats.avgResolutionTime} days`
                                : 'N/A',
                              color: 'info.main',
                            },
                          ].map((stat, index) => (
                            <Grid item xs={6} key={index}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  padding: 0.75,
                                  borderRadius: 1,
                                  backgroundColor: 'action.hover',
                                  gap: 1,
                                  alignContent: 'center',
                                }}
                              >
                                <Typography variant="body2" fontSize="0.8rem">
                                  {stat.label}
                                </Typography>
                                <Typography
                                  variant="h6"
                                  fontWeight={600}
                                  fontSize="1rem"
                                  sx={{ color: stat.color }}
                                >
                                  {stat.value}
                                </Typography>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>

                      {/* Chart */}
                      {chartData.length > 0 && (
                        <Box
                          sx={{
                            flex: '0 0 auto',
                            width: { xs: '100%', md: 260 },
                          }}
                        >
                          <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                              <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ percent }) =>
                                  percent > 0.05
                                    ? `${(percent * 100).toFixed(0)}%`
                                    : ''
                                }
                                outerRadius={65}
                                fill="#8884d8"
                                dataKey="value"
                                strokeWidth={2}
                                stroke="#fff"
                                style={{ fontSize: '14px', fontWeight: 600 }}
                              >
                                {chartData.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                  />
                                ))}
                              </Pie>
                              <Tooltip
                                contentStyle={{
                                  borderRadius: 8,
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                  border: 'none',
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>
      </Grow>
    </Modal>
  );
}

export default UserDetailsModal;
