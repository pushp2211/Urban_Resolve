import React from 'react'
import ResolutionRequestForm from '../components/ComplaintResolution/ResolutionRequestForm'
import { useParams } from 'react-router-dom'
import { useState } from 'react';
import { useLoading } from '../context/LoadingContext';
import { Box } from '@mui/material';
import ComplaintCard from '../components/ComplaintResolution/ComplaintCard';
import Snack from '../components/Snack';
function ResolutionRequest() {
    const [error, setError] = useState('');
    const {id : complaintId} = useParams();
    const [showSnack, setShowSnack] = useState(false);
    const [snackMessage, setSnackMessage] = useState('');
    const onSuccess = ()=>{
      setSnackMessage("Resolution Request submitted successfully");
      setShowSnack(true);
      
      setTimeout(()=>{
        setShowSnack(false);
        setSnackMessage('');
      }, 3000 )
      
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
        <ComplaintCard id={complaintId}/>
        <ResolutionRequestForm complaintId={complaintId} onSuccess={onSuccess}/>
        <Snack openStatus={showSnack} message={snackMessage}/>
    </Box>
  )
}

export default ResolutionRequest