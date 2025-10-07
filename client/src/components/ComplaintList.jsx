import React, { useCallback, useEffect, useRef, useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import ComplaintCard from './ComplaintCard';
import { useLocation, useSearchParams } from 'react-router-dom';
import apiClient from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../../enum/roles';
import ComplaintDetailedDialog from './ComplaintDetailedDialog';
import { useNavigate } from 'react-router-dom';
// {pinCode :"", locality : "", city : "", dateRange : "", status : "", page: 1, limit : 14}


  
function ComplaintList({ filter = {} }) {
  const {user} = useAuth();
  const navigate = useNavigate();

  const [parsedUser, setParsedUser] = useState(null);

  
  useEffect(()=>{
    if(user){
      setParsedUser((user))
    }
  }, [user])
  const [searchParams, setSearchParams] = useSearchParams();
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(true);
  const observerRef = useRef(null);
  const location = useLocation();

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [openDetailedDialogue, setOpenDetailedDialogue] = useState(false);

  const page = parseInt(searchParams.get('page')) || 1;
  const city = searchParams.get('city') || '';
  const locality = searchParams.get('locality') || '';
  const pinCode = searchParams.get('pinCode') || '';
  const status = searchParams.get('status') || '';
  const dateRange = searchParams.get('dateRange') || '';
  const limit = searchParams.get('limit') || 12;

  useEffect(() => {
    // resetting the page number on reload 
    setSearchParams(prevParams => {
      const newParams = new URLSearchParams(prevParams);
      // Set the page to 1
      newParams.set('page', '1');
      return newParams;
    });
  }, []);


  

  useEffect(() => {
    const query = new URLSearchParams();

    query.append('page', page);

    if (city) query.append('city', city);
    if (locality) query.append('locality', locality);
    if (pinCode) query.append('pinCode', pinCode);
    if (status) query.append('status', status);
    if (dateRange) query.append('dateRange', dateRange);
    if (limit) query.append('limit', limit);
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        // Ensure the value is not null/undefined before adding it
        if (value) {
          query.append(key, value);
        }
      });
    }
    console.log("query")
    console.log(query.get('submittedBy'));

    const fetchComplaints = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await apiClient.get(
          `/service?${query.toString()}`
        );
        console.log(response);
        const newComplaints = response.data.data.complaints || [];
        if (page > 1) {
          setComplaints((prev) => [...prev, ...newComplaints]);
        } else {
          setComplaints(newComplaints);
        }


        if (response.data.data.currentPage < response.data.data.totalPages) {
          setHasNextPage(true);
        } else {
          setHasNextPage(false);
        }
      } catch (error) {
        if(error.status === 401){
          localStorage.clear();
          navigate('/login');
        }
        setError('Error while fetching complaints, Try again later');
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if(hasNextPage || page==1){
      fetchComplaints();
    }
  }, [page, city, locality, pinCode, status, dateRange, limit, filter]);

  

  const handleNextPage = () => {
    const newParams = {
      page: page + 1,
    };
    if (city) newParams.city = city;
    if (locality) (newParams.locality = locality);
    if (dateRange) newParams.dateRange = dateRange;
    if (status) newParams.status = status;
    if (pinCode) newParams.pinCode = pinCode;
    if (limit) newParams.limit = limit;
  };
  const lastComplaintElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          // FIX: Use setSearchParams to trigger the next page fetch
          setSearchParams(prevParams => {
            const currentPage = parseInt(prevParams.get('page')) || 1;
            prevParams.set('page', String(currentPage + 1));
            return prevParams;
          });
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [loading, hasNextPage, setSearchParams]
  );

  const handleOnClick = (complaint)=>{
    setSelectedComplaint(complaint);
    setOpenDetailedDialogue(true)
  }


  const onAssign = (updatedComplaint)=>{
    console.log(updatedComplaint);
    setComplaints((prevComplaints)=>
      prevComplaints.map((complaint)=>
        complaint?._id === updatedComplaint?._id ? updatedComplaint : complaint
      )
    )
  };
  
  return (
    <>
    <Box
      sx={{
        height:"100%",
        width:'100%',
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:"center",
      }}
    >
      { <Grid container spacing={3} columns={2}
        sx={{
          display:"flex",
          justifyContent:"center",

        }}
      >
        {complaints.map((complaint, index) => {
          // Attach the ref to the last element to trigger infinite scroll
          if (complaints.length === index + 1) {
            return (
              <Grid
                key={complaint._id}
                ref={lastComplaintElementRef}
                onClick= {()=>{handleOnClick(complaint)}}
              >
                <ComplaintCard complaint={complaint} />
              </Grid>
            );
          } else {
            return (
              <Grid  key={complaint._id}
                onClick= {()=>{handleOnClick(complaint)}}
              >
                <ComplaintCard complaint={complaint} />
              </Grid>
            );
          }
        })}
      </Grid>}

      {/* The parent decides if we are loading the *next* page */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4, alignItems:"center", height:"100%" }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && !hasNextPage && complaints.length > 0 && (
        <Typography
          sx={{ textAlign: 'center', my: 4, color: 'text.secondary' }}
        >
          You've reached the end of the list.
        </Typography>
      )}

      {error && (
        <Typography color="error" sx={{ textAlign: 'center', my: 4 }}>
          {error}
        </Typography>
      )}
    </Box>

    {/* {parsedUser?.role ==="User" && <UserComplaintDetailedDialog complaint={selectedComplaint} open={openDetailedDialogue} 
      onClose={()=>setOpenDetailedDialogue(false)}
    />}
    {parsedUser?.role === ROLES.ADMIN && }
    {parsedUser?.role ===ROLES.STAFF && <StaffComplaintDetailedDialog complaint={selectedComplaint} open={openDetailedDialogue} 
      onClose={()=>setOpenDetailedDialogue(false)}
    />} */}
    <ComplaintDetailedDialog complaint={selectedComplaint} open={openDetailedDialogue} 
      onClose={()=>setOpenDetailedDialogue(false)} onAssign={onAssign}
    />

    </>
  );
}

export default ComplaintList;
