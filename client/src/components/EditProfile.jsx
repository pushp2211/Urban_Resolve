import React, { useState } from 'react';
import {
  Modal,
  Box,
  Stack,
  TextField,
  IconButton,
  Typography,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import apiClient from '../api/axios';
import { useAuth } from '../context/AuthContext';
function EditProfile({ open, onClose }) {
  // Field disable/enabling flags
  const [editable, setEditable] = useState({
    fullName: false,
    email: false,
    password: false,
    locality: false,
    city: false,
    district: false,
    pinCode: false,
    state: false,
  });

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    locality: '',
    city: '',
    district: '',
    pinCode: '',
    state: '',
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleToggle = (field) => {
    setEditable((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const {setUser} = useAuth();

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Submitting profile:', formData);
      const response = await apiClient.put(`/editProfile`, formData);
      const userData = response.data.data
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData);
        console.log(response);
      onClose();
    } catch (err) {
      setError('Unable to modify given details, Try agian later!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        backdropFilter: 'blur(3px)',
        backgroundColor: 'rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'auto',
        p: 2,
      }}
    >
      <Box
        sx={{
          backgroundColor: 'background.paper',
          boxShadow: 24,
          borderRadius: 2,
          p: 4,
          width: {
            xs: '90%',
            sm: '30rem',
            md: '30rem',
          },
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
          Edit Profile
        </Typography>

        <Stack spacing={2}>
          {[
            { label: 'Full Name', field: 'fullName' },
            { label: 'Email', field: 'email' },
            { label: 'Password', field: 'password', type: 'password' },
            { label: 'Locality', field: 'locality' },
            { label: 'City', field: 'city' },
            { label: 'District', field: 'district' },
            { label: 'Pin Code', field: 'pinCode' },
            { label: 'State', field: 'state' },
          ].map(({ label, field, type }) => (
            <Box
              key={field}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: "space-evenly",
                gap: 1,
              }}
            >
              <TextField
                label={label}
                type={type || 'text'}
                value={formData[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                disabled={!editable[field]}
                // fullWidth
                variant="outlined"
                size="small"

              />
              <IconButton onClick={() => handleToggle(field)} color="primary">
                <EditIcon />
              </IconButton>
            </Box>
          ))}

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}

          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
            <Button
              variant="outlined"
              color="error"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
}

export default EditProfile;