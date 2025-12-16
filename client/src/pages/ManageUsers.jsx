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
import ManageUsersFilters from '../components/admin/ManageUsersFilters';
import UserCard from '../components/admin/UserCard';
import UserDetailsModal from '../components/admin/UserDetailsModal';
import apiClient from '../api/axios';
import { useLoading } from '../context/LoadingContext';

function ManageUsers() {
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [filters, setFilters] = useState({
    role: '',
    state: '',
    district: '',
    pinCode: '',
    email: '',
  });

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    setError('');
    showLoading();

    try {
      const queryParams = new URLSearchParams({
        page,
        limit: 10,
        ...(filters.role && { role: filters.role }),
        ...(filters.state && { state: filters.state }),
        ...(filters.district && { district: filters.district }),
        ...(filters.pinCode && { pinCode: filters.pinCode }),
        ...(filters.email && { email: filters.email }),
      });

      const response = await apiClient.get(`/admin/userList?${queryParams.toString()}`);

      setUsers(response.data.data.users);
      setTotalPages(response.data.data.totalPages);
      setCurrentPage(response.data.data.currentPage);
      setTotalCount(response.data.data.totalCount);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
      hideLoading();
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchUsers(1);
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
      role: '',
      state: '',
      district: '',
      pinCode: '',
      email: '',
    });
    setCurrentPage(1);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    fetchUsers(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUserClick = async (user) => {
    setError('');
    try {
        showLoading();
      // Fetch detailed user info including complaint stats if staff
      const response = await apiClient.get(`/admin/user?email=${user.email}`);
      setSelectedUser(response.data.data);
      setModalOpen(true);
    } catch (err) {
      setError('Failed to fetch user details');
    } finally {
        hideLoading();
    //   setLoading(false);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  const handleUserUpdate = (updatedUser) => {
    // Update user in the list
    setUsers((prevUsers) =>
      prevUsers.map((u) => (u._id === updatedUser._id ? updatedUser : u))
    );
    fetchUsers(currentPage); // Refresh the list
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
          Manage Users
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage all registered users, update roles, and view staff statistics
        </Typography>
        {totalCount > 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
            {totalCount} user{totalCount !== 1 ? 's' : ''} found
          </Typography>
        )}
      </Box>

      {/* Filters */}
      <ManageUsersFilters
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

      {/* Users List */}
      {!loading && users?.length === 0 && (
        <Alert severity="info">
          No users found. Try adjusting your filters.
        </Alert>
      )}

      {!loading && users?.length > 0 && (
        <>
          {users.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              onClick={() => handleUserClick(user)}
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

      {/* User Details Modal */}
      {selectedUser && (
        <UserDetailsModal
          open={modalOpen}
          user={selectedUser}
          onClose={handleModalClose}
          onUserUpdate={handleUserUpdate}
        />
      )}
    </Container>
  );
}

export default ManageUsers;