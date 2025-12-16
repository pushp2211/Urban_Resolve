import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useLoading } from '../../context/LoadingContext';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import FilterListAltIcon from '@mui/icons-material/FilterListAlt';
import AdminFilterModal from '../AdminFilterModal';
import apiClient from '../../api/axios';

function ComplaintStats() {
  const theme = useTheme();
  const { showLoading, hideLoading } = useLoading();

  const [complaintStatsLoading, setComplaintStatsLoading] = useState(false);
  const [complaintStatsError, setComplaintStatsError] = useState('');
  const [complaintDistrict, setComplaintDistrict] = useState('');
  const [complaintCity, setComplaintCity] = useState('');
  const [complaintState, setComplaintState] = useState('');
  const [fetchedComplaintStats, setFetchedComplaintStats] = useState(null);

  const complaintFilterOptions = useMemo(
    () => [
      { label: 'City', valueSet: setComplaintCity },
      { label: 'District', valueSet: setComplaintDistrict },
      { label: 'State', valueSet: setComplaintState },
    ],
    [] // setters never change, so empty dependency list is fine
  );

  const [complaintFilterOpen, setComplaintFilterOpen] = useState(false);
  const handleComplaintFilterClose = () => {
    setComplaintFilterOpen(false);
  };
  const handleComplaintFilterOpen = () => {
    setComplaintFilterOpen(true);
  };

  const handleComplaintFilterChange = (label, value) => {
    complaintFilterOptions.forEach((element, index) => {
      if (element.label === label) {
        element.valueSet(value);
      }
    });
  };

  const handleClearComplaintFilter = ()=>{
    setComplaintCity("");
    setComplaintDistrict("");
    setComplaintState("");
  }
  const complaintStats = [
    { label: 'Total Active Complaints', value: fetchedComplaintStats?.total },
    { label: 'Resolved', value: fetchedComplaintStats?.resolved },
    { label: 'In Progress', value: fetchedComplaintStats?.inProgress },
    { label: 'Pending', value: fetchedComplaintStats?.pending },
    { label: 'Rejected', value: fetchedComplaintStats?.rejected },
  ];

  useEffect(() => {
    const controller = new AbortController();
    const fetchComplaintStats = async () => {
      setComplaintStatsError('');

      try {
        showLoading();
        setComplaintStatsLoading(true);
        const params = new URLSearchParams();
        if (complaintCity?.length > 0) {
          params.append('city', complaintCity);
        }
        if (complaintDistrict?.length > 0) {
          params.append('district', complaintDistrict);
        }
        if (complaintState?.length > 0) {
          params.append('state', complaintState);
        }

        const response = await apiClient.get(
          `/service/complaint/stats?${params.toString()}`,
          { signal: controller.signal }
        );
        // console.log(response);
        // console.log("response loaded");
        setFetchedComplaintStats(response?.data?.data);
      } catch (error) {
        if (error.name === 'CanceledError' || error.name === 'AbortError') {
          // ignore aborted requests
        } else {
          console.log(error, 'error while fetching complaint stats');
          setComplaintStatsError(
            'error occured while fetching the complaint stats'
          );
        }
      } finally {
        setComplaintStatsLoading(false);
        hideLoading();
      }
    };
    const debounce = setTimeout(fetchComplaintStats, 500);
    // fetchComplaintStats();
    return () => {
      controller.abort();
      clearTimeout(debounce);
    };
  }, [complaintDistrict, complaintCity, complaintState]);

  return (
    <Box
          sx={{
            borderRadius: '2rem',
            backgroundColor:
              theme.palette.mode === 'dark' ? '#3c4042' : '#f1f0fa',
            paddingY: 2,
            paddingX: 1,
            marginY: 2,
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {complaintStats.map((element, index) => (
              <Typography
                key={element.label}
                sx={{
                  // marginY:1
                  fontSize: '0.9rem',
                }}
                variant="overline"
              >
                {element.label} : {element.value}
              </Typography>
            ))}
          </Box>
          <Box
            sx={{
              display:"flex",
              flexDirection:"column"
            }}
          >
            <Button
            sx={{
              alignSelf: '',
              
            }}
            onClick={handleComplaintFilterOpen}
          >
            <FilterListAltIcon />
            Filter
          </Button>
          <Button
              sx={{
                alignSelf: '',
                color: theme.palette.mode === "dark" ? "#fff" : "#000"
              }}
              onClick={handleClearComplaintFilter}
            >
              <FilterAltOffIcon />
              Clear
            </Button>
          </Box>
          <AdminFilterModal
            filterOptions={complaintFilterOptions}
            openFilter={complaintFilterOpen}
            handleFilterClose={handleComplaintFilterClose}
            handleFilterChange={handleComplaintFilterChange}
          />
        </Box>
  )
}

export default ComplaintStats