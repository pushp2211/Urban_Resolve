import React, {useState, useEffect} from 'react';
import { Modal, Box, Paper, Button, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useLoading } from '../context/LoadingContext';

import apiClient from '../api/axios';
import { IconButton, Tooltip } from '@mui/material'
function ReportModal({ open, handleReportModalClose }) {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [error, setError] = useState('');
  const { showLoading, hideLoading } = useLoading();
  const [locality, setLocality] = useState('');
  useEffect(()=>{
    setTimeout(()=>{
        setError("");
    }, [5000])
  }, [error])
  const handleFetchReport = async () => {
    if (!locality) return;
    setPdfUrl('');
    setError('');
    showLoading();
    setTimeout(() => {}, [1500]);
    try {
      const response = await apiClient.get('/data/report', {
        params: {
          locality,
        },
        responseType: 'blob',
      });
      if (response.status !== 200) {
        setError('error while getting report');
      }
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(pdfBlob);
    //   setPdfUrl(url);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (error) {
        if(error.status === 404){
            setError("no complaints found in this locality");
        }
        else{
            setError('error while getting report');
        }
      
      console.log(error, 'error while getting report');
    } finally {
      hideLoading();
    }
  };
  return (
    <Modal
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backdropFilter: 'blur(10px)',
      }}
      open={open}
      onClose={handleReportModalClose}
    >
      <Paper
        sx={{
            padding:"2rem",
            borderRadius:"2rem",
            display:"flex",
            flexDirection:"column",
            gap:2,
            minWidth:"20rem",
            minHeight:"16rem"
        }}
      >
        
      <Box  
        sx={{
          display:"flex",
          flexDirection:"row",
          justifyContent:"space-between",
          alignItems:"center"
        }}
        
      >
        <Typography>Complaint Report Viewer</Typography>
        <Tooltip title="Close">
          <IconButton>
            <CloseIcon
              onClick={handleReportModalClose}
            />
          </IconButton>
        </Tooltip>
      </Box>
      <TextField label="Enter the locality here" variant="standard"
        onChange={(e)=>setLocality(e.target.value)}
      />
      <Button onClick={handleFetchReport}
      > generate report
      </Button>


      

      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {pdfUrl && (
        <div style={{ marginTop: '20px' }}>
          <iframe
            src={pdfUrl}
            title="Complaint Report"
            width="100%"
            height="700px"
            style={{ border: '1px solid #ddd' }}
          />
        </div>
      )}
      </Paper>
    </Modal>
  );
}

export default ReportModal;
