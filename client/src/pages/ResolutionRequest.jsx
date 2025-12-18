import React from 'react'
import ResolutionRequestForm from '../components/ComplaintResolution/ResolutionRequestForm'
import { useParams } from 'react-router-dom'
import { useState } from 'react';
import { useLoading } from '../context/LoadingContext';
import { Box } from '@mui/material';
import ComplaintCard from '../components/ComplaintResolution/ComplaintCard';
import Snack from '../components/Snack';
import { SNACK_SEVERITY } from '../../enum/snackSeverity';
import { COMPLAINT_STATUS } from '../../enum/ComplaintStatus';
function ResolutionRequest() {
    const [error, setError] = useState('');
    const {id : complaintId} = useParams();
    const [showSnack, setShowSnack] = useState(false);
    const [snackMessage, setSnackMessage] = useState('');
    const [snackSeverity, setSnackSeverity] = useState(SNACK_SEVERITY.INFO);
    const [curComplaint, setCurComplaint] = useState(null);
    const onSuccess = ()=>{
      setSnackMessage("Resolution Request submitted successfully");
      setSnackSeverity(SNACK_SEVERITY.SUCCESS);
      setShowSnack(true);
    }
  return (
    <Box
        sx={{
            display:"flex",
            flexDirection:{
              lg:"row",
              md:"row",
              xs:"column"
            },
            gap:{
              lg:10,
              md:5,
              xs:2
            },
            justifyContent:"center",
            alignItems:"center"
        }}
    >
        <ComplaintCard id={complaintId} setCurComplaint={setCurComplaint}/>
        {curComplaint && curComplaint.status === COMPLAINT_STATUS.IN_PROGRESS &&
          <ResolutionRequestForm complaintId={complaintId} onSuccess={onSuccess}/>
        }
        <Snack openStatus={showSnack} message={snackMessage} severity={snackSeverity} setOpenStatus={setShowSnack}/>
    </Box>
  )
}

export default ResolutionRequest