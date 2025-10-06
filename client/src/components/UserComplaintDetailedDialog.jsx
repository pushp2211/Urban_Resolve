import React from 'react'
import Dialog from '@mui/material/Dialog'


function UserComplaintDetailedDialog({open, onClose, complaint}) {

    console.log(complaint)
  return (
    <Dialog
            open={open}
            onClose={onClose}
        >
            
            This is a dialog for complaint
    </Dialog>
  )
}

export default UserComplaintDetailedDialog