import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import React, { useCallback, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { COMPLAINT_STATUS } from '../../enum/ComplaintStatus';
// pinCode, locality, city, dateRange, status

import { useLoading } from '../context/LoadingContext';
import { COMPLAINT_URGENCY } from '../../enum/ComplaintUrgency';

function CategoryButtons() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [genFilter, setGenFilter] = useState('');
  const { showLoading, hideLoading } = useLoading();

  const [statusFilter, setStatusFilter] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('');
  const handleChange = (e) => {
    setGenFilter(e.target.value);
  };
  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };
  const handleUrgencyChange = (e) => {
    setUrgencyFilter(e.target.value);
  };
  const { user } = useAuth();
  const filters = [
    { label: 'This Month', key: 'dateRange', value: 'this_month' },
    { label: 'My City', key: 'city', value: user.address?.city },
    { label: 'My Pincode', key: 'pinCode', value: user.address?.pinCode },
  ];
  const status = [
    { label: 'All', key: 'status', value: '' },
    { label: 'Pending', key: 'status', value: COMPLAINT_STATUS.PENDING },
    {
      label: 'In Progress',
      key: 'status',
      value: COMPLAINT_STATUS.IN_PROGRESS,
    },
    { label: 'Resolved', key: 'status', value: COMPLAINT_STATUS.RESOLVED },
    { label: 'Rejected', key: 'status', value: COMPLAINT_STATUS.REJECTED },
  ];
  const urgency = [
    { label: 'All', key: 'urgency', value: '' },
    { label: 'Low', key: 'urgency', value: COMPLAINT_URGENCY.LOW },
    {
      label: 'Medium',
      key: 'urgency',
      value: COMPLAINT_URGENCY.MEDIUM,
    },
    { label: 'High', key: 'urgency', value: COMPLAINT_URGENCY.HIGH },
  ];
  const handleClick = useCallback((key, value) => {
    console.log(searchParams.toString(), "hhhh");
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }

      params.set('page', '1');

      // VERY IMPORTANT → return plain object to preserve all values
      return Object.fromEntries(params.entries());
    });
  }, [searchParams]);
  useEffect(() => {
    setStatusFilter(searchParams.get('status') || 'All');
    setUrgencyFilter(searchParams.get('urgency') || 'All');
    setGenFilter(
      searchParams.get('dateRange') ||
        searchParams.get('city') ||
        searchParams.get('pinCode') ||
        ''
    );
  }, [searchParams]);

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        justifyContent: {
          xs:"center",
          sm:"left"
        },
        alignItems: 'center',
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: {
            xs: 'none',
            md: 'flex',
          },
          gap: 2,
        }}
      >
        {filters.map((filter, idx) => (
          <Button
            // id={idx}
            key={filter.key}
            variant="outlined"
            sx={{
              borderRadius: '2rem',
              paddingX: '0.8rem',
              fontSize: {
                xs: '0.7rem',
                md: '1rem',
                lg: '',
              },
            }}
            onClick={() => handleClick(filter.key, filter.value)}
          >
            {filter.label}
          </Button>
        ))}
        {/* <Button
        variant="text"
        sx={{ textTransform: 'none' }}
        onClick={() => onFilterChange('clear', null)}
       >
        Clear All
       </Button> */}
        {/* <Button>
          Hello
        </Button> */}
      </Box>
      <FormControl
        size="small"
        sx={{
          minWidth: 100,

          display: {
            // sm:"block",
            md: 'none',
            marginLeft: '0rem',
          },
        }}
      >
        <InputLabel id="filter-select-label">Filter</InputLabel>
        <Select
          labelId="filter-select-label"
          id="filter-select"
          value={genFilter}
          label="Filter"
          onChange={(e) => {
            handleChange(e);
            // handleClick("")
          }}
          sx={{
            borderRadius: '2rem',
          }}
        >
          <MenuItem
            onClick={() => setSearchParams({})}
            sx={{
              fontSize: '0.89rem',
              textAlign: 'center',
            }}
            value="All"
          >
            All
          </MenuItem>
          {filters.map((filter, idx) => (
            <MenuItem
              key={idx}
              value={filter.value}
              onClick={() => handleClick(filter.key, filter.value)}
              sx={{
                fontSize: '0.89rem',
                textAlign: 'center',
              }}
            >
              {filter.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl
        size="small"
        sx={{
          minWidth: 100,

          display: {
            // sm:"block",
          },
        }}
      >
        <InputLabel id="status-select-label">Status</InputLabel>
        <Select
          labelId="status-select-label"
          id="status-select"
          value={statusFilter}
          label="Status"
          onChange={(e) => {
            handleStatusChange(e);
            // handleClick('status', e.target.value);
          }}
          sx={{
            borderRadius: '2rem',
          }}
        >
          {status.map((status, idx) => (
            <MenuItem
              key={idx}
              value={status.label}
              onClick={() => handleClick(status.key, status.value)}
              sx={{
                fontSize: '0.89rem',
                textAlign: 'center',
              }}
              
            >
              {status.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl
        size="small"
        sx={{
          minWidth: 100,

          display: {
            // sm:"block",
          },
        }}
      >
        <InputLabel id="urgency-select-label">Urgency</InputLabel>
        <Select
          labelId="urgency-select-label"
          id="urgency-select"
          value={urgencyFilter}
          label="Urgency"
          onChange={(e) => {
            handleUrgencyChange(e);
            // handleClick('urgency', e.target.value);
          }}
          sx={{
            borderRadius: '2rem',
          }}
        >
          {urgency.map((urgency, idx) => (
            <MenuItem
              key={idx}
              value={urgency.label}
              onClick={() => handleClick(urgency.key, urgency.value)}
              sx={{
                fontSize: '0.89rem',
                textAlign: 'center',
              }}
            >
              {urgency.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default CategoryButtons;
