import React, {useState, useMemo, useEffect} from 'react'
import { Box, Typography, Button} from '@mui/material'
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import FilterListAltIcon from '@mui/icons-material/FilterListAlt';
import AdminFilterModal from '../AdminFilterModal'
import {useTheme} from '@mui/material';
import { useLoading } from '../../context/LoadingContext';
import apiClient from '../../api/axios';

function UserStats({}) {

    const theme = useTheme();
    const { showLoading, hideLoading } = useLoading();

     const [userStatsLoading, setUserStatsLoading] = useState(false);
      const [userStatsError, setUserStatsError] = useState('');
      const [userDistrict, setUserDistrict] = useState('');
      const [userCity, setUserCity] = useState('');
      const [userState, setUserState] = useState('');
      const [fetchedUserStats, setFetchedUserStats] = useState(null);

      const userStats = [
          { label: 'Total Registered User', value: fetchedUserStats?.total },
          { label: 'Staffs', value: fetchedUserStats?.staffs },
          { label: 'Admins', value: fetchedUserStats?.admins },
        ];
        const userFilterOptions = useMemo(
            () => [
              { label: 'City', valueSet: setUserCity },
              { label: 'District', valueSet: setUserDistrict },
              { label: 'State', valueSet: setUserState },
            ],
            [] // setters never change, so empty dependency list is fine
          );
        
          const [userFilterOpen, setUserFilterOpen] = useState(false);
          const handleUserFilterClose = () => {
            setUserFilterOpen(false);
          };
          const handleUserFilterOpen = () => {
            setUserFilterOpen(true);
          };
        
          const handleUserFilterChange = (label, value) => {
            userFilterOptions.forEach((element, index) => {
              if (element.label === label) {
                element.valueSet(value);
              }
            });
          };
        
          const handleClearUserFilter = ()=>{
            setUserCity("");
            setUserDistrict("");
            setUserState("");
          }

    useEffect(() => {
    const controller = new AbortController();
    const fetchUserStats = async () => {
      setUserStatsError('');

      try {
        showLoading();
        setUserStatsLoading(true);
        const params = new URLSearchParams();
        if (userCity?.length > 0) {
          params.append('city', userCity);
        }
        if (userDistrict?.length > 0) {
          params.append('district', userDistrict);
        }
        if (userState?.length > 0) {
          params.append('state', userState);
        }

        const response = await apiClient.get(
          `/service/user/stats?${params.toString()}`,
          { signal: controller.signal }
        );
        // console.log(response);
        // console.log("response loaded");
        setFetchedUserStats(response?.data?.data);
      } catch (error) {
        if (error.name === 'CanceledError' || error.name === 'AbortError') {
          // ignore aborted requests
        } else {
          console.log(error, 'error while fetching user stats');
          setUserStatsError('error occured while fetching the user stats');
        }
      } finally {
        setUserStatsLoading(false);
        hideLoading();
      }
    };
    const debounce = setTimeout(fetchUserStats, 500);
    // fetchComplaintStats();
    return () => {
      controller.abort();
      clearTimeout(debounce);
    };
  }, [userDistrict, userCity, userState]);
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
            flexGrow: 1,
            justifyContent: 'space-evenly',
            minWidth: {
              xs: '20rem',
              sm: '24rem',
              md: 'auto',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {userStats.map((element, index) => (
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
              flexDirection:"column",
              // gap:1
            }}
          >
            <Button
              sx={{
                alignSelf: '',
              }}
              onClick={handleUserFilterOpen}
              
            >
              <FilterListAltIcon color='' />
              Filter
            </Button>
            <Button
            variant='standard'
              sx={{
                alignSelf: '',
                color: theme.palette.mode === "dark" ? "#fff" : "#000"
              }}
              onClick={handleClearUserFilter}
            >
              <FilterAltOffIcon />
              Clear
            </Button>
          </Box>
          <AdminFilterModal
            filterOptions={userFilterOptions}
            openFilter={userFilterOpen}
            handleFilterClose={handleUserFilterClose}
            handleFilterChange={handleUserFilterChange}
          />
        </Box>
  )
}

export default UserStats