import React from 'react'
import { Modal } from '@mui/material'
import {Box} from '@mui/material'

function EditProfile({open, onClose}) {
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
              alignItems:"center",
              // overflow:"scroll"
            }}
    >
        <Box>
            hello
        </Box>

    </Modal>
  )
}

export default EditProfile