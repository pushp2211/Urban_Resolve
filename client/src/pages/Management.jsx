import { Box, Container, Button } from '@mui/material';
import { Typography } from '@mui/material';
import React, { useEffect, useState, useMemo } from 'react';
import theme from '../theme';
import Search from '../components/Search';
import UserManageModal from '../components/UserManageModal';
import apiClient from '../api/axios';
import FilterListAltIcon from '@mui/icons-material/FilterListAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import AdminFilterModal from '../components/AdminFilterModal';
function Management() {
  // setSearchValue, searchResult, loading, error, handleSearch, searchValue
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [complaintStatsLoading, setComplaintStatsLoading] = useState(false);
  const [complaintStatsError, setComplaintStatsError] = useState('');
  const [complaintDistrict, setComplaintDistrict] = useState('');
  const [complaintCity, setComplaintCity] = useState('');
  const [complaintState, setComplaintState] = useState('');
  const [fetchedComplaintStats, setFetchedComplaintStats] = useState(null);

  const [userStatsLoading, setUserStatsLoading] = useState(false);
  const [userStatsError, setUserStatsError] = useState('');
  const [userDistrict, setUserDistrict] = useState('');
  const [userCity, setUserCity] = useState('');
  const [userState, setUserState] = useState('');
  const [fetchedUserStats, setFetchedUserStats] = useState(null);

  const [userPanelOpen, setUserPanelOpen] = useState(false);

  const handleOnUserClick = () => {
    setUserPanelOpen(true);
  };

  const handleOnUserPanelClose = () => {
    setUserPanelOpen(false);
  };

  useEffect(() => {
    if (!searchValue) {
      setSearchResult([]);
      return;
    }

    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await apiClient.get(
          `/admin/searchUser?email=${searchValue}`,
          { signal: controller.signal }
        );
        setSearchResult([]);
        setSearchResult([response.data.data]);
        // console.log(response.data.data)
      } catch (error) {
        if (error.name === 'CanceledError' || error.name === 'AbortError') {
          // ignore aborted requests
        } else {
          console.error(error);
          setError('User not found');
        }
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchData, 500);

    return () => {
      controller.abort();
      clearTimeout(debounce);
    };
  }, [searchValue]);

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
      }
    };
    const debounce = setTimeout(fetchComplaintStats, 500);
    // fetchComplaintStats();
    return () => {
      controller.abort();
      clearTimeout(debounce);
    };
  }, [complaintDistrict, complaintCity, complaintState]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchUserStats = async () => {
      setUserStatsError('');

      try {
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
    <Container
      sx={{
        display: 'flex',
        flexDirection: {
          xs: 'column',
          sm: 'column',
          md: 'row',
          lg: 'row',
        },
        gap: {
          xs: 1,
          sm: 1,
          md: 2,
        },
        justifyContent: {
          xs: 'flex-start',
          sm: 'flex-start',
          md: 'space-evenly',
          lg: 'space-evenly',
        },
        alignItems: 'center',
        minHeight: '78svh',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexGrow: 1,
          flexDirection: 'column',
        }}
      >
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
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          borderRadius: '2rem',
          backgroundColor:
            theme.palette.mode === 'dark' ? '#3c4042' : '#f1f0fa',
          paddingY: 2,
          paddingX: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          alignItems: 'center',
          minHeight: {
            lg: '25rem',
            xs: '20rem',
          },
          // width:"100%"
        }}
      >
        <Typography
          sx={{
            width: '100%',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '1.2rem',
          }}
          // variant='h7'
        >
          SEARCH TO GET USER PROFILE AND <br /> MANAGE THEIR ROLE
        </Typography>

        <Search
          searchResult={searchResult}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          loading={loading}
          error={error}
          handleOnClick={handleOnUserClick}
        />
      </Box>
      {userPanelOpen && searchResult[0] && (
        <UserManageModal
          open={userPanelOpen}
          handleOnClose={handleOnUserPanelClose}
          user={searchResult[0]}
        />
      )}
    </Container>
  );
}

export default Management;
