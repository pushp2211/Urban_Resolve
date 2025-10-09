import { Box, Container } from '@mui/material';
import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import theme from '../theme';
import Search from '../components/Search';
import UserManageModal from '../components/UserManageModal';
import apiClient from '../api/axios';

function Management() {
  // setSearchValue, searchResult, loading, error, handleSearch, searchValue
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);


  const [complaintStatsLoading, setComplaintStatsLoading] = useState(false);
  const[complaintStatsError, setComplaintStatsError] = useState("");
  const [complaintDistrict, setCcomplaintDistrict] = useState("");
  const [complaintCity, setComplaintCity] = useState("");
  const [complaintState, setComplaintState] = useState("");
  const [fetchedComplaintStats, setFetchedComplaintStats] = useState(null);


  const [userStatsLoading, setUserStatsLoading] = useState(false);
  const[userStatsError, setUserStatsError] = useState("");
  const [userDistrict, setUserDistrict] = useState("");
  const [userCity, setUserCity] = useState("");
  const [userState, setUserState] = useState("");
  const [fetchedUserStats, setFetchedUserStats] = useState(null);


  const[userPanelOpen, setUserPanelOpen] = useState(false);

  const handleOnUserClick = ()=>{
    setUserPanelOpen(true);
  }
  
  const handleOnUserPanelClose=()=>{
    setUserPanelOpen(false);
  }

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
        setSearchResult([response.data.data])
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

  const complaintStats = [
    { label: 'Total Active Complaints', value: fetchedComplaintStats?.total },
    { label: 'Resolved', value: fetchedComplaintStats?.resolved },
    { label: 'In Progress', value: fetchedComplaintStats?.inProgress },
    { label: 'Pending', value: fetchedComplaintStats?.pending },
    { label: 'Rejected', value: fetchedComplaintStats?.rejected },
  ];

  useEffect(()=>{
    
    const fetchComplaintStats = async()=>{
      setComplaintStatsError("")

      try {
        setComplaintStatsLoading(true);
        const params = new URLSearchParams();
        if(complaintCity?.length>0){
          params.append("city", complaintCity);
        }
        if(complaintDistrict?.length>0){
          params.append("district", complaintDistrict);
        }
        if(complaintState?.length>0){
          params.append("state", complaintState);
        }
        
        const response = await apiClient.get(`/service/complaint/stats?${params.toString()}`)
        // console.log(response);
        // console.log("response loaded");
        setFetchedComplaintStats(response?.data?.data);
      } catch (error) {
        console.log(error, "error while fetching complaint stats");
        setComplaintStatsError("error occured while fetching the complaint stats");
      }
      finally{
        setComplaintStatsLoading(false);
      }
    }
    fetchComplaintStats();
  }, [complaintDistrict, complaintCity, complaintState, ])

  useEffect(()=>{
    
    const fetchUserStats = async()=>{
      setUserStatsError("")

      try {
        setUserStatsLoading(true);
        const params = new URLSearchParams();
        if(userCity?.length>0){
          params.append("city", userCity);
        }
        if(userDistrict?.length>0){
          params.append("district", userDistrict);
        }
        if(userState?.length>0){
          params.append("state", userState);
        }
        
        const response = await apiClient.get(`/service/user/stats?${params.toString()}`)
        // console.log(response);
        // console.log("response loaded");
        setFetchedUserStats(response?.data?.data);
      } catch (error) {
        console.log(error, "error while fetching user stats");
        setUserStatsError("error occured while fetching the user stats");
      }
      finally{
        setUserStatsLoading(false);
      }
    }
    fetchUserStats();
  }, [userDistrict, userCity, userState, ])

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
        gap:{
            xs:1,
            sm:1,
            md:2,

        },
        justifyContent: {
          xs: 'flex-start',
          sm: 'flex-start',
          md: 'space-evenly',
          lg: 'space-evenly',
        },
        alignItems:"center",
        minHeight: '78svh'
      }}
    >
      <Box
        sx={{
            display:"flex",
            flexGrow:1,
            flexDirection:"column",
        }}

      >
        <Box
          sx={{
            borderRadius: '2rem',
            backgroundColor:
              theme.palette.mode === 'dark' ? '#3c4042' : '#f1f0fa',
            paddingY: 2,
            paddingX: 1,
            marginY:2,
            display:"flex",
            alignItems:"center",
            flexDirection:"column",
            flexGrow:1,
            justifyContent:"center",
            minWidth:{
                xs:"20rem",
                sm:"24rem",
                md:"auto"
            },
          }}
        >
          {userStats.map((element, index) => (
            <Typography
              key={element.label}
                sx={{
                    // marginY:1
                    fontSize:"0.9rem"
                }}
                variant='overline'
            >
              {element.label} : {element.value}
            </Typography>
          ))}
        </Box>
        <Box
          sx={{
            borderRadius: '2rem',
            backgroundColor:
              theme.palette.mode === 'dark' ? '#3c4042' : '#f1f0fa',
            paddingY: 2,
            paddingX: 1,
            marginY:2,
            display:"flex",
            alignItems:"center",
            flexDirection:"column"
          }}
        >
          {complaintStats.map((element, index) => (
            <Typography
              key={element.label}
                sx={{
                    // marginY:1
                    fontSize:"0.9rem"
                }}
                variant='overline'
            >
              {element.label} : {element.value}
            </Typography>
          ))}
        </Box>
      </Box>
      <Box
        sx={{
            flexGrow:1,
            borderRadius: '2rem',
            backgroundColor:
            theme.palette.mode === 'dark' ? '#3c4042' : '#f1f0fa',
            paddingY: 2,
            paddingX: 1,
            display:"flex",
            flexDirection:"column",
            gap:2,
            alignItems:"center",
            minHeight:{
              lg:"25rem",
              xs:"20rem"
            }
            // width:"100%"
        }}
      >
        <Typography
          sx={{
            width:"100%",
            textAlign:"center",
            fontWeight:"bold",
            fontSize:"1.2rem"
          }}
          // variant='h7'
        >
          SEARCH TO GET USER PROFILE AND <br/> MANAGE THEIR ROLE
        </Typography>
        
        <Search searchResult={searchResult} searchValue={searchValue} 
        setSearchValue={setSearchValue} loading={loading} error={error} handleOnClick={handleOnUserClick}/>

      </Box>
      <UserManageModal open={userPanelOpen} handleOnClose = {handleOnUserPanelClose} user={searchResult[0]}/>
    </Container>
  );
}

export default Management;
