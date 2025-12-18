import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Paper,
  Button,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useLoading } from '../context/LoadingContext';
import { Autocomplete } from '@mui/material';
import { INDIAN_STATES } from '../../utils/indianStates';

import apiClient from '../api/axios';
import { IconButton, Tooltip } from '@mui/material';
function ReportModal({ open, handleReportModalClose }) {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [error, setError] = useState('');
  const { showLoading, hideLoading } = useLoading();
  const [pinCode, setPinCode] = useState('');
  const [state, setState] = useState('');
  useEffect(() => {
    setTimeout(() => {
      setError('');
    }, 5000);
    // return () => clearTimeout(timer);
  }, [error]);
  const handleFetchReport = async () => {
    // console.log("111")
    if (!pinCode && !state) {
      setError('Enter atleast one of the details to get the report');
      return;
    }
    setPdfUrl('');
    setError('');
    showLoading();
    const params = new URLSearchParams();
    if (pinCode) params.set('pinCode', pinCode);
    if (state) params.set('state', state);
    // console.log(params);
    try {
      const response = await apiClient.get(
        `/data/report?${params.toString()}`,
        {
          responseType: 'blob',
        }
      );
      // if (response.status !== 200) {
      //   setError('error while getting report');
      // }
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(pdfBlob);
      //   setPdfUrl(url);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (error) {
      console.log(error);

      // If backend sent a JSON error inside blob
      if (error.response && error.response.data instanceof Blob) {
        const text = await error.response.data.text(); // convert blob → text
        try {
          const json = JSON.parse(text); // text → JSON
          setError(json.message || 'Something went wrong');
        } catch {
          setError(text); // Sometimes backend sends plain text
        }
      } else {
        setError(error.message || 'Something went wrong');
      }

      console.log('error while getting report');
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
      onClose={(e) => handleReportModalClose(e)}
    >
      <Paper
        sx={{
          padding: '2rem',
          borderRadius: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          minWidth: '20rem',
          minHeight: '16rem',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography></Typography>

          <Typography variant="button">Complaint Report</Typography>
          <Tooltip title="Close">
            <IconButton>
              <CloseIcon onClick={handleReportModalClose} />
            </IconButton>
          </Tooltip>
        </Box>

        <TextField
          label="Enter the pin code here"
          variant="standard"
          onChange={(e) => setPinCode(e.target.value)}
        />
        <Autocomplete
          disablePortal
          options={INDIAN_STATES}
          onChange={(e, newValue) => {
            setState(newValue);
          }}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="State"
              variant="standard"
              // onChange={(e)=>setState(e.target.value)}
              error={state != '' && !INDIAN_STATES.includes(state)}
            />
          )}
        />
        <Button onClick={handleFetchReport}> generate report</Button>
        <Typography variant="caption">
          Enter state or pincode, to get the report in pdf format
        </Typography>

        {error && (
          <Typography
            variant="caption"
            color="error"
            sx={{
              textAlign: 'center',
            }}
          >
            {error}
          </Typography>
        )}

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
