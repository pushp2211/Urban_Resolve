import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Stack,
  TextField,
  IconButton,
  Typography,
  Button,
  Divider,
  CircularProgress,
  Chip,
  InputAdornment,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import apiClient from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { fetchAddressDetails } from '../../utils/pincodeToAddress';
import { useTheme, alpha } from '@mui/material/styles';

function EditProfile({ open, onClose }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const glassDarkBg = alpha(theme.palette.background.paper, 0.25);
  const lightBg = theme.palette.background.paper;
  const sectionBg = alpha(theme.palette.text.primary, 0.07);

  const initialEditable = {
    fullName: false,
    email: false,
    newPassword: false,
    locality: false,
    pinCode: false,
  };

  const initialForm = {
    fullName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    locality: '',
    pinCode: '',
    city: '',
    district: '',
    state: '',
  };

  const [editable, setEditable] = useState(initialEditable);
  const [adressLoading, setAddressLoading] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { setUser } = useAuth();

  const resetForm = () => {
    setEditable(initialEditable);
    setFormData(initialForm);
    setError('');
    setLoading(false);
    setAddressLoading(false);
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  useEffect(() => {
    if (!open) resetForm();
  }, [open]);

  useEffect(() => {
    const fetchAdd = async () => {
      setError('');

      if (formData.pinCode.length > 0 && formData.pinCode.length !== 6) {
        setError('Pincode must be exactly 6 digits');
        return;
      }
      if (!formData.pinCode) {
        setFormData((prev) => ({ ...prev, city: '', district: '', state: '' }));
        return;
      }

      try {
        setAddressLoading(true);
        const response = await fetchAddressDetails(formData.pinCode);
        const data = response[0];

        if (data.Status !== 'Success') {
          setError('Invalid pincode');
          return;
        }

        const { Region, District, State } = data.PostOffice[0];

        setFormData((prev) => ({
          ...prev,
          city: Region,
          district: District,
          state: State,
        }));
      } catch {
        setError('Could not fetch address. Try again.');
      } finally {
        setAddressLoading(false);
      }
    };

    fetchAdd();
  }, [formData.pinCode]);

  const handleToggle = (field) => {
    setEditable((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    let hasChanges = false;

    const fieldsToCheck = ["fullName", "email", "newPassword", "locality", "pinCode"];
    for (const field of fieldsToCheck) {
      if (formData[field] && formData[field].trim() !== '') {
        hasChanges = true;
        break;
      }
    }

    if (!hasChanges) {
      setError('No change has been provided');
      setLoading(false);
      return;
    }

    if (!formData.currentPassword) {
      setError('Please enter your current password to update profile');
      setLoading(false);
      return;
    }

    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      setError('New password and Confirm password do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.put(`/editProfile`, formData);
      const userData = response.data.data;

      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        backdropFilter: 'blur(6px)',
        backgroundColor: isDark ? alpha('#000', 0.45) : alpha('#000', 0.2),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Box
        sx={{
          width: { xs: '92%', sm: 450 },
          borderRadius: 4,
          boxShadow: theme.shadows[12],
          p: 4,
          maxHeight: '90vh',
          overflowY: 'auto',
          animation: 'popIn 0.22s ease-out',
          bgcolor: isDark ? glassDarkBg : lightBg,
          backdropFilter: isDark ? 'blur(22px)' : 'none',
          border: `1px solid ${alpha(theme.palette.divider, 0.18)}`,
          '@keyframes popIn': {
            from: { transform: 'scale(0.92)', opacity: 0 },
            to: { transform: 'scale(1)', opacity: 1 },
          },
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, textAlign: 'center', mb: 2 }}
        >
          Edit Profile
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Stack spacing={2}>
          {[
            { label: 'Full Name', field: 'fullName' },
            { label: 'Email', field: 'email' },
            {
              label: 'New Password',
              field: 'newPassword',
              type: 'password',
              show: showNewPassword,
              toggle: setShowNewPassword,
            },
            { label: 'Locality', field: 'locality' },
            { label: 'Pin Code', field: 'pinCode' },
          ].map(({ label, field, type, show, toggle }) => (
            <React.Fragment key={field}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  background: sectionBg,
                  p: 1.2,
                  borderRadius: 2,
                }}
              >
                <TextField
                  fullWidth
                  label={label}
                  type={
                    type === 'password' ? (show ? 'text' : 'password') : 'text'
                  }
                  value={formData[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  disabled={!editable[field]}
                  size="small"
                  variant="filled"
                  slotProps={{
                    endAdornment:
                      type === 'password' ? (
                        <InputAdornment position="end">
                          <IconButton onClick={() => toggle((s) => !s)}>
                            {show ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ) : null,
                  }}
                />

                <IconButton
                  onClick={() => handleToggle(field)}
                  size="small"
                  sx={{
                    bgcolor: editable[field]
                      ? theme.palette.primary.main
                      : alpha(theme.palette.text.primary, 0.15),
                    color: theme.palette.common.white,
                    '&:hover': {
                      bgcolor: editable[field]
                        ? theme.palette.primary.dark
                        : alpha(theme.palette.text.primary, 0.25),
                    },
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Box>

              {/* CONFIRM PASSWORD – ONLY SHOW WHEN NEW PASSWORD IS BEING CHANGED */}
              {field === 'newPassword' &&
                editable.newPassword &&
                formData.newPassword.length > 0 && (
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleChange('confirmPassword', e.target.value)
                    }
                    size="small"
                    variant="filled"
                    sx={{
                      mt: -1,
                      background: sectionBg,
                      borderRadius: 2,
                    }}
                    slotProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword((s) => !s)}
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
            </React.Fragment>
          ))}

          <TextField
            fullWidth
            label="Current Password (Required)"
            type={showCurrentPassword ? 'text' : 'password'}
            value={formData.currentPassword}
            onChange={(e) => handleChange('currentPassword', e.target.value)}
            size="small"
            variant="outlined"
            sx={{ mt: 1 }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowCurrentPassword((s) => !s)}>
                      {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          {adressLoading && (
            <Stack direction="row" justifyContent="center">
              <CircularProgress size={22} />
            </Stack>
          )}

          {(formData.city || formData.state) && (
            <Box sx={{ mt: 2, p: 2, borderRadius: 3, background: sectionBg }}>
              <Typography variant="subtitle2" sx={{ mb: 1, opacity: 0.8 }}>
                Auto-detected Address:
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                sx={{
                  overflowX: 'auto',
                  whiteSpace: 'nowrap',
                  pb: 1,
                  '&::-webkit-scrollbar': { display: 'none' },
                }}
              >
                {['city', 'district', 'state'].map((f) => (
                  <Chip
                    key={f}
                    label={`${f.charAt(0).toUpperCase() + f.slice(1)}: ${
                      formData[f]
                    }`}
                    color="primary"
                    variant="filled"
                    sx={{
                      height: 26,
                      fontSize: '0.7rem',
                      px: 1,
                      borderRadius: '14px',
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {error && (
            <Typography color="error" textAlign="center">
              {error}
            </Typography>
          )}

          <Divider sx={{ my: 2 }} />

          <Stack direction="row" spacing={2} justifyContent="flex-end">
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
              onClick={handleSubmit}
              disabled={loading || adressLoading}
            >
              {loading ? 'Saving…' : 'Save Changes'}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
}

export default EditProfile;
