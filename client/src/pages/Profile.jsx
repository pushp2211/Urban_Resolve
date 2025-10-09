import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {Button} from '@mui/material';
import { Avatar, Container } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import InfoPieChart from '../components/InfoPieChart';
import apiClient from '../api/axios';
import theme from '../theme';
import { COMPLAINT_STATUS } from '../../enum/ComplaintStatus';
import EditProfile from '../components/EditProfile';
import { ROLES } from '../../enum/roles';
import { useLoading } from '../context/LoadingContext';
function Profile() {
  const { user } = useAuth();
  const [userComplaintDetails, setUserComplaintDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState([]);


  const {showLoading, hideLoading} = useLoading();

  const [totalComplaints, setTotalComplaints] = useState(0);
  const [resolved, setResolved] = useState(0);
  const [inProgress, setInprogress] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [pending, setPending] = useState(0);

  const [editOpen, setEditOpen] = useState(false);

  const setEditOpenController = ()=>{
    setEditOpen(true);
  }
  const setEditCloseController = ()=>{
    setEditOpen(false);
  }

  const STATUS_COLORS = {
    Resolved: '#005f00', // Green
    Pending: '#e95101', // Orange
    'In Progress': '#3814d8', // Blue
    Rejected: '#c90000', // Red
  };

  useEffect(() => {
    setTotalComplaints(0);
    data.map((element, index) => {
      setTotalComplaints((prev) => prev + element.value);
      if (element.label === COMPLAINT_STATUS.IN_PROGRESS)
        setInprogress(element.value);
      if (element.label === COMPLAINT_STATUS.PENDING) setPending(element.value);
      if (element.label === COMPLAINT_STATUS.REJECTED)
        setRejected(element.value);
      if (element.label === COMPLAINT_STATUS.RESOLVED)
        setResolved(element.value);
    });
    console.log(totalComplaints);
  }, [data]);

  useEffect(() => {
    const fetchInfo = async () => {
      setError('');
      setLoading(true);
      try {
        showLoading();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const response = await apiClient.get(`/profile`);
        if (response.status !== 200) {
          setError('Error occured while fetching the profile information');
          return;
        }
        console.log(response.data.data);
        const complaintStats = response.data?.data?.complaintStats;
        // console.log(complaintStats);
        setUserComplaintDetails(complaintStats);

        // console.log(userComplaintDetails)
      } catch (error) {
        setError('Error while fetching profile information');
        console.log(error);
      } finally {
        hideLoading();
        setLoading(false);
      }
    };
    fetchInfo();
  }, [user]);

  useEffect(() => {
    const chartData = userComplaintDetails
      ? Object.keys(userComplaintDetails).map((key, index) => ({
          id: index,
          value: userComplaintDetails[key],
          label: key,
          color: STATUS_COLORS[key],
        }))
      : [];
    setData(chartData);
  }, [userComplaintDetails]);

  return (
    <Container
      sx={{
        // bgcolor: 'gray',
        minHeight: '78svh',
        display: 'flex',
        gap: '4',
        // alignItems: 'center',
        flexDirection: {
          xs: 'column',
          sm: 'column',
          lg: 'row',
          xl: 'row',
        },
        paddingY: {
          xs:0,
          lg:3
        },
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          height: '100%',
          flexGrow: 1,
          display: 'flex',
          // justifyContent:"center",
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <Avatar
          alt={user.fullName}
          src={user.profilePicture}
          sx={{ width: {
            xs:110,
            md:120,
            lg:130,
          },
             height: {
            xs:110,
            md:120,
            lg:130,
          }
             }}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 1,
            backgroundColor:
              theme.palette.mode === 'dark' ? '#3c4042' : '#f1f0fa',
            borderRadius: '1rem',
          }}
        >
          <Typography variant="h7">ROLE:</Typography>

          <Typography variant="h7">{user.role}</Typography>
        </Box>
        <Box>
          <Button
            sx={{
              borderRadius:"3rem",

              backgroundColor:theme.palette.mode === 'dark' ? '#3c4042' : '#f1f0fa',
              paddingX:1,
              fontSize:{
                xs:"0.7rem",
                md:"1rem",
                lg:""
              }
            }}
            onClick={setEditOpenController}
          >
            Edit Profile
          </Button>
        </Box>
        <Box
          sx={{
            // display:"flex",
            // gap:1,
            // alignItems:"center",
            // justifyContent:"center"
          }}
        >
          <Typography color='text.secondary' variant='overline'
            sx={{
              fontSize:"1rem",
              
            }}
            // align='center'
          >
            Addres details
          </Typography>
          <Box
          sx={{
            display:"flex",
            flexDirection:"column"
          }}
          >
            <Typography
              variant='overline'
              sx={{
                fontWeight:"medium"
              }}
            >
              {user?.address?.locality}, {user?.address?.city}, {user?.address?.district}
            </Typography>
            <Typography
              variant='overline'
              sx={{
                fontWeight:"medium"
              }}
            >
              {user?.address?.state}{",  "}{user?.address?.pinCode}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          height: '100%',
          flexGrow: 1,
          // bgcolor: 'green',
          padding: 1,
        }}
      >
        <Box
          sx={{
            display:"flex",
            flexDirection:"column",

          }}
        >
          <Typography
            // variant="h3"
            sx={{
              fontWeight: 'bold',
              textAlign:{
                xs:"center",
                sm:"center",
                md:"center",
                lg:"left"
              },
              fontSize:{
                xs:"1rem",
                md:"1.2rem",
                lg:"3rem"
              },
              width:"100%"
            }}
          >
            Hello &nbsp;
            {user.fullName?.length > 10
              ? `${user.fullName?.slice(0, 10)}…`
              : user.fullName}
            !
          </Typography>
          <Typography variant="button"
            sx={{
              textAlign:{
                xs:"center",
                sm:"center",
                md:"center",
                lg:"left"
              },
              width:"100%",
              alignSelf:"center"
            }}
          >
            A cleaner, safer society starts with you
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: {
              xs: 'column',
              sm: 'column',
              lg: 'row',
            },
          }}
        >
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: {
                xs: 'column',
                sm: 'column',
                lg: 'row',
                xl: 'row',
              },
              alignItems: 'center',

              gap: 2,
              justifyContent: {
                lg: 'space-between',
                sm: 'center',
                xs: 'center',
              },
            }}
          >
            {totalComplaints>0 && <InfoPieChart data={data} colors={STATUS_COLORS} />}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Typography
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 2,
                  backgroundColor:
                    theme.palette.mode === 'dark' ? '#3c4042' : '#f1f0fa',
                  borderRadius: '1rem',
                }}
              >
                {user.role !==ROLES.STAFF && `Total Complaints reported: ${totalComplaints}`}
                {user.role ===ROLES.STAFF && `Total Complaints Assigned: ${totalComplaints}`}
              </Typography>
              <Typography
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 2,
                  backgroundColor:
                    theme.palette.mode === 'dark' ? '#3c4042' : '#f1f0fa',
                  borderRadius: '1rem',
                }}
              >
                Resolved: {resolved}
              </Typography>
              <Typography
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 2,
                  backgroundColor:
                    theme.palette.mode === 'dark' ? '#3c4042' : '#f1f0fa',
                  borderRadius: '1rem',
                }}
              >
                In Progress: {inProgress}
              </Typography>
              {user.role!==ROLES.STAFF && <Typography
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 2,
                  backgroundColor:
                    theme.palette.mode === 'dark' ? '#3c4042' : '#f1f0fa',
                  borderRadius: '1rem',
                }}
              >
                Pending:{pending}
              </Typography>}
              {user.role!==ROLES.STAFF && <Typography
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 2,
                  backgroundColor:
                    theme.palette.mode === 'dark' ? '#3c4042' : '#f1f0fa',
                  borderRadius: '1rem',
                  
                }}
                
              >
                Rejected: {rejected}
              </Typography>}
            </Box>
          </Box>
          <Box></Box>
        </Box>
      </Box>
      <EditProfile open={editOpen} onClose={setEditCloseController}/>
    </Container>
  );
}

export default Profile;
