import React, {useState, useEffect} from 'react';
import { Snackbar } from '@mui/material';
function Snack({ message, openStatus }) {

  const [open, setOpen] = useState(false);
  useEffect(()=>{
    if(openStatus){
        setOpen(true);
    }
  }, [openStatus])

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return; // Optional safeguard
    setOpen(false);
  };
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={handleClose}
      message={message}
    />
  );
}

export default Snack;
