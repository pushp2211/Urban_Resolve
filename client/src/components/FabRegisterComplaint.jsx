import * as React from 'react';
import { Fab, Box, Modal, Typography, TextField, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ComplaintRegister from './ComplaintRegister';
export default function FabRegisterComplaint() {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  return (
    <>
      {/* Floating Button */}
      <Fab
        color="primary"
        aria-label="edit"
        
        sx={{
          position: 'fixed',
          bottom: {
            xs:80,
            lg:150
          },
          right: {
            xs:20,
            lg:124
          },
          zIndex: 1300,
        }}
        onClick={handleOpen}
        hidden={open}
      >
        <EditIcon />
      </Fab>

      {/* Complaint Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="complaint-modal-title"
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <ComplaintRegister  handleClose={handleClose}/>
      </Modal>
    </>
  );
}
