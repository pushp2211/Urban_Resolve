import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import {
  COMPLAINT_STATUS,
  COMPLAINT_STATUS_ENUM,
} from '../../enum/ComplaintStatus';
import Avatar from '@mui/material/Avatar';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../../enum/roles';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import apiClient from '../api/axios';
import StaffListDialog from './StaffListDialog.jsx';
import theme from '../theme.js';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import CloseIcon from '@mui/icons-material/Close';
import { triggerNotification } from '../../utils/notificationService.js';


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
function DetailedComplaint({ complaint, onAssign, onClose }) {
  // console.log(theme);

  const { user } = useAuth();
  const assignedTo = complaint.assignedTo;
  const [listOpen, setListOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [eligibleListError, setEligibleError] = useState(false);

  const [staffAssignError, setStaffAssignError] = useState('');
  const [staffAssignLoading, setStaffAssignLoading] = useState(false);
  


  const [validComplaintStatus, setValidComplaintStatus] = useState([]);
  const [statusError, setStatusError] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);
  const [curComplaintStatus, setComplaintCurStatus] = useState(complaint.status)

  useEffect(() => {
    if (complaint.status === COMPLAINT_STATUS.IN_PROGRESS) {
      setValidComplaintStatus([COMPLAINT_STATUS.IN_PROGRESS,COMPLAINT_STATUS.RESOLVED]);
    }
    if (complaint.status === COMPLAINT_STATUS.PENDING) {
      setValidComplaintStatus([COMPLAINT_STATUS.PENDING,COMPLAINT_STATUS.REJECTED]);
    }
    // if(complaint.status === COMPLAINT_STATUS.)
  }, [complaint.status, curComplaintStatus]);

  const handleChange = async(event) => {
    if(event.target.value=="") return;
    event.stopPropagation();
    const id = complaint._id;
    console.log(event.target.value);
    // const status = complaint.status;
    const newStatus = event.target.value;
    setStatusError("");
    setStatusLoading(true);
    try {

      const response = await apiClient.put(`/admin/updateStatus/${id}`, {status:newStatus});
      if(response.status !== 200){
        setStatusError("Encountered an error while updating the status");
        return;
      }
      // console.log(response);
      
      const upDatedComplaint = response.data.data;
      complaint.status = upDatedComplaint.status;
      setComplaintCurStatus(complaint.status);
      onAssign(upDatedComplaint);
      triggerNotification(
        {
          recipient_id:complaint.submittedBy,
          message:`Your complaint (topic: ${complaint.title}) status has been changed to ${complaint.status}`,
          complaint_id:complaint._id
        }
      )
      
    } catch (error) {
      setStaffAssignError('Unable to update, please try again.');
      console.error('Error updating status:', error);
    }
    finally{
      setStatusLoading(false);
    }
  };

  const getEligibleStaffList = async (event) => {
    setListOpen(true);
    event.stopPropagation();
    event.preventDefault();
    const adminId = user._id;
    setEligibleError('');
    setLoading(true);

    try {
      const response = await apiClient.get(`/admin/staffList/${complaint._id}`);
      if (response.status != 200) {
        setEligibleError('error while fetching try again', response.status);
        return;
      }
      let simplifiedArray = [];
      // console.log(response.data.data);
      if (response.data.data.length === 0) {
        setEligibleError(
          'no staff found in the district of the complaint address'
        );
      } else {
        simplifiedArray = response.data.data.map((item) => ({
          _id: item?._id,
          fullName: item?.fullName,
          profilePicture: item?.profilePicture,
        }));
        setStaffList(simplifiedArray);
      }
    } catch (error) {
      setEligibleError('error while retrieving the list, try again later');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStaff = async (staff) => {
    const id = complaint._id;
    const staffId = staff._id;
    if (!id || !staffId) {
      setStaffAssignError('staff id not found');
      return;
    }

    setStaffAssignError('');
    setLoading(true);
    try {
      const response = await apiClient.put(`/admin/assignComplaint/${id}`, {
        staffId,
      });
      // console.log(Response);
      if (response.status != 200) {
        setStaffAssignError('unable to assign, try again');
        return;
      }
      // console.log(response);
      const updatedComplaint = response.data.data;
      complaint.status = updatedComplaint.status;
      onAssign(updatedComplaint);
      triggerNotification(
        {
          recipient_id:staffId,
          message:`You have been assigned a complaint from locality ${updatedComplaint.address?.locality} (Topic: ${updatedComplaint.title}, Urgency: ${updatedComplaint.urgency})`,
          complaint_id:updatedComplaint._id
        }
      )
      triggerNotification(
        {
          recipient_id:complaint.submittedBy,
          message:`Your complaint (topic: ${complaint.title}) has been cassigned to staff, we'll be happy to solve as soon as possible`,
          complaint_id:complaint._id
        }
      )
      setListOpen(false);
      setLoading(false);
    } catch (error) {
      setStaffAssignError('Unable to assign, please try again.');
      console.error('Error assigning staff:', error);
    } finally {
      setStaffAssignLoading(false);
    }
  };

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
          xs: '24rem',
          sm: '24rem',
          md: '30rem',
          lg: '60rem',
        },
        backgroundColor: 'background.paper',
        borderRadius: '2rem',
        paddingX: '1rem',
        paddingY: '1rem',
        
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
              width: '100%',
            }}
          >
            <Box
              sx={{
                display:{
                  xs:'flex',
                  lg:"none"
                },
                justifyContent:"space-between",
                alignItems:"center"

              }}
              
            >
              <Typography variant="button">{complaint.title}</Typography>
              <Button
                onClick={onClose}
                color='warning'
              >
                Close
                <CloseIcon/>
              </Button>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2,
                marginY: '0.2rem',
                minWidth: '100%',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Avatar
                  alt={complaint.submittedBy?.fullName}
                  src={complaint.submittedBy?.profilePicture}
                />
                <Typography variant="button">
                  {complaint.submittedBy?.fullName}
                </Typography>
              </Box>
              <Chip
                label={complaint?.status}
                color={getStatusColor(complaint?.status)}
                size="small"
              />
            </Box>
          </Box>
        </Container>
        <Container>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              paddingTop: '56.25%', // 16:9 aspect ratio (9/16 = 0.5625 * 100)
              overflow: 'hidden',
              borderRadius: 1,
              marginY: {
                lg:'1rem',
                xs:"0.3rem"
              }
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
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            {new Date(complaint.createdAt).toLocaleDateString()}
            <Typography variant="button">Type: {complaint.type}</Typography>
          </Typography>
        </Container>
        <Container>
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
          gap: {
            lg:2,
            sm:1,
            xs:1,
          },
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
            gap:{
              lg:2,
              xs:1,
              sm:1
            }
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              flexDirection: 'row',
              backgroundColor:
                theme.palette.mode === 'dark' ? '#3c4042' : '#f1f0fa',
              paddingX: {
              lg:'1rem',
              xs:"0.5rem"
            },
            paddingY: {
              lg:'1rem',
              xs:"0.5rem"
            },
              borderRadius: '1rem',
            }}
          >
            <Typography>Reported by :</Typography>
            <Typography>{complaint.submittedBy?.fullName}</Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              flexDirection: 'row',
              backgroundColor:
                theme.palette.mode === 'dark' ? '#3c4042' : '#f1f0fa',
              paddingX: {
              lg:'1rem',
              xs:"0.5rem"
            },
            paddingY: {
              lg:'1rem',
              xs:"0.5rem"
            },
              borderRadius: '1rem',
            }}
          >
            <Typography>Assigned To :</Typography>
            {complaint.assignedTo && (
              <Typography>{complaint.assignedTo?.fullName}</Typography>
            )}
            {!complaint.assignedTo && <Typography>Not assigned yet</Typography>}
          </Box>
        </Box>
        {user.role === ROLES.ADMIN && !complaint.assignedTo && (
          <Box
            sx={{
              backgroundColor:
                theme.palette.mode === 'dark' ? '#3c4042' : '#f1f0fa',
              paddingX: {
              lg:'1rem',
              xs:"0.5rem"
            },
            paddingY: {
              lg:'1rem',
              xs:"0.5rem"
            },
              borderRadius: '1rem',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: "space-between",
              gap: '8%',
            }}
          >
            Assign to
            <Button
              onClick={getEligibleStaffList}
              variant="contained"
              loading={loading}
              disabled={listOpen}
              sx={{
                marginLeft: '0.4rem',
                textTransform: 'none',
              }}
            >
              Click here ..
            </Button>
            {!loading && (
              <Dialog
                open={listOpen}
                onClose={() => setListOpen(false)}
                maxWidth="lg"
              >
                <DialogTitle>Select a Staff Member</DialogTitle>
                <StaffListDialog
                  staffList={staffList}
                  onSelectStaff={setSelectedStaff}
                  assignComplaint={handleSelectStaff}
                />
              </Dialog>
            )}
          </Box>
        )}
        {(user.role === ROLES.ADMIN || user.role ===ROLES.STAFF) && <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 1,
            backgroundColor:
              theme.palette.mode === 'dark' ? '#3c4042' : '#f1f0fa',
            paddingX: {
              lg:'1rem',
              xs:"0.5rem"
            },
            paddingY: {
              lg:'1rem',
              xs:"0.5rem"
            },
            borderRadius: '1rem',
            alignItems:"center",
            justifyContent:"space-between"
          }}
        >
          Change status
          <FormControl
            sx={{ m: 1, minWidth: 120 }}
            size="small"
            disabled = {statusLoading || curComplaintStatus===COMPLAINT_STATUS.REJECTED || curComplaintStatus===COMPLAINT_STATUS.RESOLVED

              || (user.role===ROLES.STAFF && user._id !== assignedTo)
            }
          >
            <InputLabel id="demo-select-small-label">Status</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={curComplaintStatus}
              label="Status"
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {validComplaintStatus.map((value) => (
                <MenuItem value={value}>{value}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>}
      </Box>
    </Box>
  );
}

export default DetailedComplaint;
