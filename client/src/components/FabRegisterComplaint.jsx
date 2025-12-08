import * as React from 'react';
import { Fab, Box, Modal} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import ComplaintRegister from './ComplaintRegister';
import {Grow} from '@mui/material';
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
        <Grow in={open} timeout={200}>
          <Box
            sx={{
              outline:"none",
              border:"none"
            }}
          >
          <ComplaintRegister  handleClose={handleClose}/>
          </Box>
        </Grow>
      </Modal>
    </>
  );
}
