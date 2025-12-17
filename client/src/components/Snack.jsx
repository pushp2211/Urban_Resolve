import React, { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
function Snack({ message, openStatus, severity, setOpenStatus }) {
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    setOpen(openStatus);
  }, [openStatus]);

  useEffect(()=>{
    if (openStatus && setOpenStatus) {
      const timer = setTimeout(()=>{
        setOpenStatus(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [openStatus]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
    if (setOpenStatus) {
      setOpenStatus(false);
    }
  };
  return (
    <Snackbar
      open={open}
      autoHideDuration={3500}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={handleClose}
        severity={severity || "info"}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

export default Snack;
