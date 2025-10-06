import React from 'react'
import Dialog from '@mui/material/Dialog'
import DetailedComplaint from './DetailedComplaint'
import Modal from '@mui/material/Modal'
function AdminComplaintDetailedDialog({open, onClose, complaint, onAssign}) {

  return (
    <Modal
            open={open}
            onClose={onClose}
            // maxWidth="40rem"
            sx={{
              backdropFilter: 'blur(2px)',
              backgroundColor: 'rgba(0,0,0,0.3)',
              width:"100%",
              display:"flex",
              justifyContent:"center",
              alignItems:"center"
            }}
        >
          <DetailedComplaint complaint={complaint} onAssign={onAssign}/>
    </Modal>
  )
}

export default AdminComplaintDetailedDialog