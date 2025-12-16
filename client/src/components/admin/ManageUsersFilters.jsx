import React, { useState } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Grid,
  Chip,
  Autocomplete,
  InputAdornment,

} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { INDIAN_STATES } from '../../../utils/indianStates';
import { ROLES } from '../../../enum/roles';

function ManageUsersFilters({ filters, onFilterChange, onClearFilters }) {
  const [showFilters, setShowFilters] = useState(true);

  const handleChange = (field, value) => {
    onFilterChange(field, value);
  };

  const hasActiveFilters = filters.role || filters.state || filters.pinCode || filters.district || filters.email;

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
              sx={{ height: 24 }}
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
        <Box>
          {/* Email Search - Full Width */}
          <Box sx={{ marginBottom: 2 }}>
            <TextField
              fullWidth
              label="Search by Email"
              variant="outlined"
              size="small"
              value={filters.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Enter email address..."
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Box>

          <Grid container spacing={2}>
            {/* Role */}
            <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small" sx={{minWidth:100}}>
              <InputLabel
                sx={{whiteSpace: 'nowrap'}}
              >Role</InputLabel>
              <Select
                value={filters.role || ''}
                onChange={(e) => handleChange('role', e.target.value)}
                label="Role"
                sx={{ borderRadius: 2 }}
                
              >
                <MenuItem value="">All Roles</MenuItem>
                <MenuItem value={ROLES.USER}>User</MenuItem>
                <MenuItem value={ROLES.STAFF}>Staff</MenuItem>
                <MenuItem value={ROLES.ADMIN}>Admin</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* State */}
          <Grid item xs={12} sm={6} md={3}>
            <Autocomplete
              fullWidth
              size="small"
              options={INDIAN_STATES}
              value={filters.state || null}
              onChange={(e, newValue) => handleChange('state', newValue || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="State"
                  placeholder="Search state"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                    minWidth:190
                  }}
                  
                />
              )}
            />
          </Grid>

          {/* District */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="District"
              value={filters.district || ''}
              onChange={(e) => handleChange('district', e.target.value)}
              placeholder="e.g., North District"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Grid>

          {/* Pincode */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Pincode"
              value={filters.pinCode || ''}
              onChange={(e) => handleChange('pinCode', e.target.value)}
              placeholder="e.g., 110001"
              size="small"
              slotProps={{
                htmlInput: { maxLength: 6 }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Grid>
        </Grid>
        </Box>
      )}
    </Paper>
  );
}

export default ManageUsersFilters;
