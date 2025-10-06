import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { COMPLAINT_STATUS } from '../../enum/ComplaintStatus';
import Avatar from '@mui/material/Avatar';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../../enum/roles';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import apiClient from '../api/axios';
import StaffListDialog from './StaffListDialog.jsx';
import theme from '../theme.js';

const getStatusColor = (status) => {


  switch (status) {
    case COMPLAINT_STATUS.PENDING:
      return 'warning';
    case COMPLAINT_STATUS.IN_PROGRESS:
      return 'primary';
    case COMPLAINT_STATUS.RESOLVED:
      return 'success';
    case COMPLAINT_STATUS.REJECTED:
      return 'danger';
    default:
      return 'default';
  }
};
function DetailedComplaint({ complaint }) {

  console.log(theme);


  const { user } = useAuth();
  const [listOpen, setListOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const getEligibleStaffList = async (event) => {
    setListOpen(true);
    event.stopPropagation();
    event.preventDefault();
    const adminId = user._id;
    setError('');
    setLoading(true);

    try {
      const response = await apiClient.get(`/admin/staffList/${complaint._id}`);
      if (response.status != 200) {
        setError('error while fetching try again', response.status);
        return;
      }
      let simplifiedArray = [];
      console.log(response.data.data);
      if (response.data.data.length === 0) {
        setError('no staff found in the district of the complaint address');
      } else {
        simplifiedArray = response.data.data.map((item) => ({
          _id: item._id,
          fullName: item.fullName,
          profilePicture: item.profilePicture,
        }));
        console.log('simplified array');
        console.log(simplifiedArray);
        setStaffList(simplifiedArray);
      }
    } catch (error) {
      setError('error while retrieving the list, try again later');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStaff = (staffId) => {};
  useEffect(() => {
    console.log(staffList);
  }, [staffList]);

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 3,
        alignItems: 'center',
        // justifyContent: 'space-between',
        // bgcolor:"red",
        flexDirection: {
          xs: 'column',
          sm: 'column',
          lg: 'row',
        },
        // backdropFilter:"blur(20px)",
        width: {
          xs: '19rem',
          sm: '24rem',
          md: '30rem',
          lg: '60rem',
        },
        backgroundColor: 'background.paper',
        borderRadius:"2rem",
        paddingX:"1rem"
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          justifyContent: 'center',
          alignItems: 'center',
          width: {
            xs: '19rem', // extra-small devices: full width
            sm: '24rem', // small devices: 25rem
            md: '30rem', // medium devices: 30rem
            lg: '33rem', // large devices: 35rem
            xl: '40rem', // extra large devices: 40rem
          },
          paddingY: '1rem',
        }}
      >
        <Container
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.1rem',
            }}
          >
            
            <Typography variant='h4'>{complaint.title}

            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Avatar
                alt={complaint.submittedBy.fullName}
                src={complaint.submittedBy.profilePicture}
              />
              <Typography variant='button'>{complaint.submittedBy.fullName}</Typography>
            </Box>
          </Box>
          <Chip
            label={complaint.status}
            color={getStatusColor(complaint.status)}
            size="small"
          />
        </Container>
        <Container>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              paddingTop: '56.25%', // 16:9 aspect ratio (9/16 = 0.5625 * 100)
              overflow: 'hidden',
              borderRadius: 1,
              marginY: '1rem',
            }}
          >
            <Box
              component="img"
              src={complaint.photoUrl}
              alt="loading..."
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>
          <Typography 
            sx={{
              display:"flex",
              justifyContent:"space-between"
            }}
          >
            {new Date(complaint.createdAt).toLocaleDateString()}
            <Typography
              variant='h6'
          >Type: {complaint.type}</Typography>
          </Typography>
        </Container>
        <Container >
          <Typography>{complaint.description}</Typography>
          
        </Container>
      </Box>
      {/* */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          flexGrow: 1,
          gap: 2,
          marginRight: '1rem',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            // justifyContent:"center",
            // alignItems:"center",
            width: '100%',
            flexDirection: 'column',
            gap:2
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              flexDirection: 'row',
              backgroundColor: theme.palette.mode === "dark" ? "#3c4042" : "#f1f0fa",
              paddingX:"1rem",
              paddingY:"1rem",
              borderRadius:"1rem"
            }}
          >
            <Typography >Submitted By :</Typography>
            <Typography>{complaint.submittedBy.fullName}</Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              flexDirection: 'row',
              backgroundColor: theme.palette.mode === "dark" ? "#3c4042" : "#f1f0fa",
              paddingX:"1rem",
              paddingY:"1rem",
              borderRadius:"1rem"
            }}
          >
            <Typography>Submitted By :</Typography>
            {complaint.assignedTo && (
              <Typography>{complaint.assignedTo?.fullName}</Typography>
            )}
            {!complaint.assignedTo && <Typography>Not assigned yet</Typography>}
          </Box>
        </Box>
        {user.role === ROLES.ADMIN && !complaint.assignedTo && (
          <Box
            
          >
            Assign this Complaint 
            <Button
              onClick={getEligibleStaffList}
              variant="contained"
              loading={loading}
              disabled={listOpen}
              sx={{
                marginLeft:"0.4rem",
                textTransform: 'none',
              }}
            >
              Click here ..
            </Button>
            {!loading && <Dialog
              open={listOpen}
              onClose={() => setListOpen(false)}
              maxWidth="lg"
              
            >
              <DialogTitle>Select a Staff Member</DialogTitle>
              <StaffListDialog
                staffList={staffList}
                onSelectStaff={setSelectedStaff}
              />
            </Dialog>}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default DetailedComplaint;
