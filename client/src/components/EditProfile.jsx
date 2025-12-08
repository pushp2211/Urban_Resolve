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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import apiClient from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { fetchAddressDetails } from '../../utils/pincodeToAddress';

function EditProfile({ open, onClose }) {
  const [editable, setEditable] = useState({
    fullName: false,
    email: false,
    password: false,
    locality: false,
    pinCode: false,
  });

  const [adressLoading, setAddressLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    locality: '',
    pinCode: '',
    city: '',
    district: '',
    state: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAdd = async () => {
      setError('');

      if (formData.pinCode.length > 0 && formData.pinCode.length !== 6) {
        setError('Pincode must be exactly 6 digits');
        return;
      }
      if (!formData.pinCode || formData.pinCode.length === 0){
        setFormData({
          ...formData,
          city: '',
          district: '',
          state: '',
        });
        return;
      };

      try {
        setAddressLoading(true);
        const response = await fetchAddressDetails(formData.pinCode);
        const data = response[0];

        if (data.Status !== 'Success') {
          setError('Invalid pincode');
          return;
        }

        const { Region, District, State } = data.PostOffice[0];

        setFormData({
          ...formData,
          city: Region,
          district: District,
          state: State,
        });
      } catch (err) {
        setError('Could not fetch address. Try again.');
      } finally {
        setAddressLoading(false);
      }
    };

    fetchAdd();
  }, [formData.pinCode]);

  const { setUser } = useAuth();

  const handleToggle = (field) => {
    setEditable((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.put(`/editProfile`, formData);
      const userData = response.data.data;

      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      onClose();
    } catch (err) {
      setError('Unable to update details. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        backdropFilter: "blur(6px)",
        backgroundColor: "rgba(0, 0, 0, 0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Box
        sx={{
          width: { xs: "92%", sm: 450 },
          bgcolor: "rgba(30, 30, 30, 0.75)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 4,
          boxShadow: "0 20px 45px rgba(0,0,0,0.35)",
          p: 4,
          maxHeight: "90vh",
          overflowY: "auto",
          animation: "popIn 0.20s ease-out",
          color: "white",
          "@keyframes popIn": {
            from: { transform: "scale(0.92)", opacity: 0 },
            to: { transform: "scale(1)", opacity: 1 },
          },
        }}
      >
        {/* Title */}
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, textAlign: "center", mb: 2 }}
        >
          Edit Profile
        </Typography>

        <Divider sx={{ mb: 3, borderColor: "rgba(255,255,255,0.15)" }} />

        <Stack spacing={2}>
          {/* Editable Fields */}
          {[
            { label: "Full Name", field: "fullName" },
            { label: "Email", field: "email" },
            { label: "Password", field: "password", type: "password" },
            { label: "Locality", field: "locality" },
            { label: "Pin Code", field: "pinCode" },
          ].map(({ label, field, type }) => (
            <Box
              key={field}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                background: "rgba(255,255,255,0.05)",
                p: 1.2,
                borderRadius: 2,
              }}
            >
              <TextField
                fullWidth
                label={label}
                type={type || "text"}
                value={formData[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                disabled={!editable[field]}
                size="small"
                variant="filled"
                sx={{
                  "& .MuiFilledInput-root": {
                    background: "rgba(255,255,255,0.08)",
                    color: "white",
                  },
                }}
              />

              <IconButton
                onClick={() => handleToggle(field)}
                size="small"
                sx={{
                  bgcolor: editable[field] ? "primary.main" : "rgba(255,255,255,0.15)",
                  color: "#fff",
                  "&:hover": {
                    bgcolor: editable[field]
                      ? "primary.dark"
                      : "rgba(255,255,255,0.25)",
                  },
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}

          {/* Show loader */}
          {adressLoading && (
            <Stack direction="row" justifyContent="center">
              <CircularProgress size={22} color="inherit" />
            </Stack>
          )}

          {/* City / District / State as Compact Chips */}
{(formData.city || formData.state) && (
  <Box
    sx={{
      mt: 2,
      p: 2,
      borderRadius: 3,
      background: "rgba(255,255,255,0.08)",
    }}
  >
    <Typography
      variant="subtitle2"
      sx={{ mb: 1, opacity: 0.8, fontSize: "0.8rem" }}
    >
      Auto-detected Address:
    </Typography>

    <Stack
      direction="row"
      spacing={1}
      sx={{
        overflowX: "auto",
        whiteSpace: "nowrap",
        pb: 1,
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      <Chip
        label={`City: ${formData.city}`}
        color="primary"
        variant="filled"
        sx={{
          height: 26,
          fontSize: "0.7rem",
          px: 1,
          borderRadius: "14px",
        }}
      />

      <Chip
        label={`District: ${formData.district}`}
        color="primary"
        variant="filled"
        sx={{
          height: 26,
          fontSize: "0.7rem",
          px: 1,
          borderRadius: "14px",
        }}
      />

      <Chip
        label={`State: ${formData.state}`}
        color="primary"
        variant="filled"
        sx={{
          height: 26,
          fontSize: "0.7rem",
          px: 1,
          borderRadius: "14px",
        }}
      />
    </Stack>
  </Box>
)}


          {/* Error */}
          {error && (
            <Typography color="error" textAlign="center" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}

          <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.1)" }} />

          {/* Buttons */}
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              color="error"
              onClick={onClose}
              disabled={loading}
              sx={{ borderRadius: 3, px: 2 }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || adressLoading}
              sx={{ borderRadius: 3, px: 3 }}
            >
              {loading ? "Saving…" : "Save Changes"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
}

export default EditProfile;
