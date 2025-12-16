import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Pagination,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PendingReviewFilters from '../components/admin/PendingReviewFilters';
import ReviewComplaintCardCompact from '../components/admin/ReviewComplaintCardCompact';
import ReviewDetailsSidebar from '../components/admin/ReviewDetailsSidebar';
import apiClient from '../api/axios';
import { useLoading } from '../context/LoadingContext';

function ReviewRequests() {
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [filters, setFilters] = useState({
    state: '',
    city: '',
    pinCode: '',
    urgency: '',
    sortBy: 'createdAt',
  });

  const fetchComplaints = async (page = 1) => {
    setLoading(true);
    setError('');
    showLoading();

    try {
      const params = {
        page,
        limit: 10,
        ...(filters.state && { state: filters.state }),
        ...(filters.city && { city: filters.city }),
        ...(filters.pinCode && { pinCode: filters.pinCode }),
        ...(filters.urgency && { urgency: filters.urgency }),
        ...(filters.sortBy && { sortBy: filters.sortBy }),
      };

      const response = await apiClient.get('/admin/complaints/pending-review', { params });

      setComplaints(response.data.data.complaints);
      setTotalPages(response.data.data.totalPages);
      setCurrentPage(response.data.data.currentPage);
      setTotalCount(response.data.data.totalCount);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to fetch pending review complaints');
    } finally {
      setLoading(false);
      hideLoading();
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchComplaints(1);
    }, 500);

    return () => clearTimeout(debounce);
  }, [filters]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      state: '',
      city: '',
      pinCode: '',
      urgency: '',
      sortBy: 'createdAt',
    });
    setCurrentPage(1);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    fetchComplaints(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReviewed = () => {
    fetchComplaints(currentPage);
  };

  const handleComplaintClick = (complaint) => {
    setSelectedComplaint(complaint);
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
    setSelectedComplaint(null);
  };

  return (
    <Container maxWidth="lg" sx={{ paddingY: 4 }}>
      {/* Header */}
      <Box sx={{ marginBottom: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/management')}
          sx={{ marginBottom: 2 }}
        >
          Back to Management
        </Button>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Resolution Review Center
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review and approve resolution requests submitted by staff members
        </Typography>
        {totalCount > 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
            {totalCount} pending review{totalCount !== 1 ? 's' : ''}
          </Typography>
        )}
      </Box>

      {/* Filters */}
      <PendingReviewFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ marginBottom: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Complaints List */}
      {!loading && complaints.length === 0 && (
        <Alert severity="info">
          No pending review complaints found. Try adjusting your filters.
        </Alert>
      )}

      {!loading && complaints.length > 0 && (
        <>
          {complaints.map((complaint) => (
            <ReviewComplaintCardCompact
              key={complaint._id}
              complaint={complaint}
              onClick={() => handleComplaintClick(complaint)}
            />
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}

      {/* Review Details Sidebar */}
      <ReviewDetailsSidebar
        open={sidebarOpen}
        complaint={selectedComplaint}
        onClose={handleSidebarClose}
        onReviewed={handleReviewed}
      />
    </Container>
  );
}

export default ReviewRequests;