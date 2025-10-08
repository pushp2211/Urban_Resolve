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

    // 1️⃣ create controller for this invocation
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await apiClient.get(
          `/admin/searchUser?email=${searchValue}`,
          { signal: controller.signal } // 2️⃣ Attach abort signal
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

    // 3️⃣ Debounce: wait briefly so we don't fire on every keystroke
    const debounce = setTimeout(fetchData, 500);

    // 4️⃣ Cleanup: cancel any pending fetch if input changes or component unmounts
    return () => {
      controller.abort();
      clearTimeout(debounce);
    };
  }, [searchValue]);


  const userStats = [
    { label: 'Total Registered User', value: '100' },
    { label: 'Staffs', value: '100' },
    { label: 'Admins', value: '100' },
  ];

  const complaintStats = [
    { label: 'Total Active Complaints', value: '100' },
    { label: 'Resolved', value: '100' },
    { label: 'In Progress', value: '100' },
    { label: 'Pending', value: '100' },
    { label: 'Rejected', value: '100' },
  ];


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
            minHeight:"100%",
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
