import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  CircularProgress,
  Alert,
  Button,
  Paper,
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import UserDetailsModal from '../components/admin/UserDetailsModal';
import AdminComplaintCard from '../components/admin/AdminComplaintCard';
import StaffCard from '../components/StaffCard';
import { getComplaint } from '../api/getComplaintDetail';
import { useLoading } from '../context/LoadingContext';
import Snack from '../components/Snack';
function AssignComplaint() {
  const { id:complaintId } = useParams();
  const navigate = useNavigate();
  const {showLoading, hideLoading} = useLoading();

  const [complaint, setComplaint] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [complaintLoading, setComplaintLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [assigning, setAssigning] = useState(false);
  const [emailSearch, setEmailSearch] = useState('');

    const [snackOpen, setSnackOpen] = useState(false);
    const [snackMessage, setSnackMessage] = useState("");
  useEffect(() => {
    if (complaintId) {
      fetchComplaint();
    }
  }, [complaintId]);

  useEffect(() => {
    if (complaint) {
      fetchStaffList();
    }
  }, [complaint, page, sortBy, emailSearch]);

  const fetchComplaint = async () => {
    showLoading()
    setComplaintLoading(true);
    setError('');
    try {
      const response = await getComplaint(complaintId);
      setComplaint(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch complaint details');
    } finally {
      setComplaintLoading(false);
      hideLoading()
    }
  };

  const fetchStaffList = async () => {
    if (!complaint?.address?.district) return;
    
    setLoading(true);
    setError('');
    try {
        showLoading();
      const response = await apiClient.get('/admin/staff-by-district', {
        params: {
          district: complaint.address.district,
          page,
          limit: 6,
          sortBy,
          ...(emailSearch && { email: emailSearch })
        }
      });

      setStaffList(response.data.data.staff);
      setTotalPages(response.data.data.totalPages);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch staff list');
    } finally {
        hideLoading();
      setLoading(false);
    }
  };

  const handleStaffClick = (staff) => {
    setSelectedStaff(staff);
    setModalOpen(true);
  };

  const handleAssign = async (staffId) => {
    setAssigning(true);
    showLoading()
    try {
      await apiClient.put(`/admin/assignComplaint/${complaint._id}`, {
        staffId
      });
      setSnackOpen(true);
      setSnackMessage("complaint assigned successfully");
      fetchComplaint();
    //   alert("complaint assigned successfully");
    //   navigate(-1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign complaint');
    } finally {
        hideLoading();
      setAssigning(false);
    }
  };

  if (complaintLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!complaint) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Complaint not found or you don't have permission to view it.
        </Alert>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 3 }, px: { xs: 2, sm: 3 } }}>
        {/* Header Section */}
        <Box sx={{ mb: 3 }}>
          <Button
            onClick={() => navigate(-1)}
            sx={{ mb: 2, textTransform: 'none' }}
          >
            ← Back to Management
          </Button>
          <Typography variant="h5" fontWeight={600} sx={{ mb: 0.5 }}>
            Assign Staff Member
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Select an available staff member to handle this complaint
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Grid container spacing={{ xs: 2, md: 3 }} sx={{
          px:{
            xs:1,
            sm:1,
            md:2
          }
        }}>
        {/* Complaint Details - Left Side */}
        <Grid item xs={12} lg={5} sx={
          {
            width:{
              xs:"100%",
              sm:"100%",
              md:"100%",
              // lg:"auto"
            }
          }
        } >
          <AdminComplaintCard complaint={complaint} />
        </Grid>

        {/* Staff Selection - Right Side */}
        <Grid item xs={12} lg={7}
          sx={{
            width:{
              xs:"100%",
              sm:"100%",
              md:"100%",
              // lg:"auto"
            }
          }}
        >
          {/* Controls Header */}
          <Box
            sx={{
              width: '100%',
              mb: 2,
              p: { xs: 2, sm: 2.5 },
              bgcolor: 'background.paper',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Available Staff
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {complaint.address.district} District • {staffList.length} members
                </Typography>
              </Box>
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Sort By"
                >
                  <MenuItem value="name">Name (A-Z)</MenuItem>
                  <MenuItem value="avgResolutionTime">Fastest</MenuItem>
                  <MenuItem value="workload">Least Busy</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <TextField
              fullWidth
              size="small"
              placeholder="Search by email..."
              value={emailSearch}
              onChange={(e) => {
                setEmailSearch(e.target.value);
                setPage(1);
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          {/* Staff List */}
          <Box sx={{ width: '100%' }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
              </Box>
            ) : staffList.length === 0 ? (
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                No staff members available{emailSearch ? ' matching your search' : ''} in {complaint.address.district} district.
              </Alert>
            ) : (
              <>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                    maxHeight: { xs: 'none', lg: 'calc(100vh - 350px)' },
                    overflowY: { xs: 'visible', lg: 'auto' },
                    pr: { lg: 1 },
                    '&::-webkit-scrollbar': {
                      width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: 'transparent',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '3px',
                      '&:hover': {
                        background: 'rgba(0, 0, 0, 0.3)',
                      },
                    },
                    
                  }}
                >
                  {staffList.map((staff) => (
                    <Box key={staff._id} sx={{ minHeight: '120px', flexShrink: 0 }}>
                      <StaffCard
                        staff={staff}
                        onViewDetails={() => handleStaffClick(staff)}
                        onAssign={() => handleAssign(staff._id)}
                        assigning={assigning}
                      />
                    </Box>
                  ))}
                </Box>

                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={(e, value) => setPage(value)}
                      color="primary"
                      size="medium"
                    />
                  </Box>
                )}
              </>
            )}
          </Box>
        </Grid>
      </Grid>

        {/* User Details Modal */}
        {selectedStaff && (
          <UserDetailsModal
            open={modalOpen}
            user={selectedStaff}
            onClose={() => {
              setModalOpen(false);
              setSelectedStaff(null);
            }}
            onUserUpdate={(updatedUser) => {
              setStaffList(prevList =>
                prevList.map(staff =>
                  staff._id === updatedUser._id ? { ...staff, ...updatedUser } : staff
                )
              );
            }}
          />
        )}
        <Snack openStatus={snackOpen} message={snackMessage} />
    </Container>
  );
}

export default AssignComplaint;