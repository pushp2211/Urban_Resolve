import React, { useState } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button,
  Paper,
  Grid,
  IconButton,
  CircularProgress,
  Chip,
  Autocomplete,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { COMPLAINT_URGENCY } from '../../../enum/ComplaintUrgency';
import { fetchAddressDetails } from '../../../utils/pincodeToAddress';
import { INDIAN_STATES } from '../../../utils/indianStates';

function PendingReviewFilters({ filters, onFilterChange, onClearFilters }) {
  const [showFilters, setShowFilters] = useState(true);
  const [loadingPincode, setLoadingPincode] = useState(false);
  const [pincodeError, setPincodeError] = useState('');
  const [pincode,setPincode] = useState('');
  const handleChange = (field, value) => {
    onFilterChange(field, value);
  };

  const handlePincodeChange = async (pincode) => {
    setPincode(pincode);
    if(pincode.length>0 && pincode.length !== 6){
      setPincodeError("pincode must be of 6 digits");
      return;
    }
    filters.pinCode = pincode;
    handleChange('pinCode', pincode);
    setPincodeError('');

    // Clear state and city when pincode is cleared
    if (!pincode || pincode.length === 0) {
      handleChange('state', '');
      handleChange('city', '');
      return;
    }

    if (pincode.length === 6) {
      setLoadingPincode(true);
      try {
        const response = await fetchAddressDetails(pincode);
        if (response && response[0]?.Status === 'Success') {
          const postOffice = response[0].PostOffice[0];
          handleChange('city', postOffice.District);
          handleChange('state', postOffice.State);
        } else {
          setPincodeError('Invalid pincode');
          setTimeout(() => setPincodeError(''), 3000);
        }
      } catch (error) {
        setPincodeError('Failed to fetch location');
        setTimeout(() => setPincodeError(''), 3000);
      } finally {
        setLoadingPincode(false);
      }
    }
  };

  const hasActiveFilters = filters.state || filters.pinCode || filters.urgency;

  return (
    <Paper
      elevation={0}
      sx={{
        padding: { xs: 1.5, sm: 2 },
        marginBottom: 3,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: showFilters ? 2 : 0,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <FilterListIcon sx={{ color: 'primary.main' }} />
          <Button 
            onClick={() => setShowFilters(!showFilters)}
            sx={{ 
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '1rem',
            }}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          {hasActiveFilters && (
            <Chip 
              label="Filtered" 
              size="small" 
              color="primary" 
              sx={{ height: 25 }}
            />
          )}
        </Box>
        <Button
          startIcon={<ClearIcon />}
          onClick={onClearFilters}
          variant="outlined"
          size="small"
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          Clear All
        </Button>
      </Box>

      {showFilters && (
        <Grid container spacing={2}>
          {/* Pincode - First for auto-fill */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Pincode"
              value={pincode || ''}
              onChange={(e) => handlePincodeChange(e.target.value)}
              placeholder="Enter 6-digit pincode"
              size="small"
              error={!!pincodeError}
              helperText={pincodeError}
              slotrops={{ maxLength: 6 }}
              slotProps={{
                startAdornment: <LocationOnIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />,
                endAdornment: loadingPincode ? <CircularProgress size={20} /> : null,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Grid>

          {/* State - Autocomplete */}
          <Grid item xs={12} sm={6} md={4.5}>
            <Autocomplete
            disablePortal
              fullWidth
              size="small"
              options={INDIAN_STATES}
              value={filters.state || null}
              onChange={(e, newValue) => handleChange('state', newValue || '')}
              sx={{
                width:195
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="State"
                  placeholder="Search or select state"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              )}
            />
          </Grid>

          {/* Urgency */}
          <Grid item xs={12} sm={6} md={4.5}>
            <FormControl fullWidth size="small" sx={{ minWidth: 150 }}>
              <InputLabel sx={{ whiteSpace: 'nowrap' }}>Urgency</InputLabel>
              <Select
                value={filters.urgency || ''}
                onChange={(e) => handleChange('urgency', e.target.value)}
                label="Urgency"
                sx={{
                  borderRadius: 2,
                  minWidth: 195,
                }}
              >
                <MenuItem value="">All Urgencies</MenuItem>
                <MenuItem value={COMPLAINT_URGENCY.HIGH}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'error.main' }} />
                    High
                  </Box>
                </MenuItem>
                <MenuItem value={COMPLAINT_URGENCY.MEDIUM}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'warning.main' }} />
                    Medium
                  </Box>
                </MenuItem>
                <MenuItem value={COMPLAINT_URGENCY.LOW}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
                    Low
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Sort By - This will wrap to second row on medium screens */}
          <Grid item xs={12} sm={6} md={12}>
            <FormControl fullWidth size="small" sx={{ maxWidth: { md: 300 } }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={filters.sortBy || 'createdAt'}
                onChange={(e) => handleChange('sortBy', e.target.value)}
                label="Sort By"
                sx={{
                  borderRadius: 2,
                }}
              >
                <MenuItem value="createdAt">Newest First</MenuItem>
                <MenuItem value="urgency">Urgency (High to Low)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      )}
    </Paper>
  );
}

export default PendingReviewFilters;
