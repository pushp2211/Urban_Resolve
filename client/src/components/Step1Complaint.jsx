import React, { useEffect } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Box from '@mui/material/Box'
import { COMPLAINT_TYPE_ENUM } from '../../enum/ComplaintType';
import { COMPLAINT_URGENCY_ENUM } from '../../enum/ComplaintUrgency'

function Step1Complaint({formData, handleChange, handleFileChange, complaintPicture}) {
    // title, description, type, locality, district, city, pinCode, state,  urgency 

    
  return (
    <Stack
        sx={{
            gap:2,
            marginBottom:'1rem'
        }}
    >
        <TextField
            required
            name='title'
            label='Title'
            variant='outlined'
            value={formData.title}
            onChange={handleChange}
            
        />
        <TextField
            required
            name='description'
            label='Description'
            variant='outlined'
            value={formData.description}
            onChange={handleChange}
        />
        <TextField
            required
            name='type'
            label='Type'
            variant='outlined'
            value={formData.type}
            onChange={handleChange}
            placeholder={"Any one of "+ COMPLAINT_TYPE_ENUM.join(', ')}
            error={(formData.type.toString().length>0 && !(COMPLAINT_TYPE_ENUM.includes(formData.type)))}
            helperText={
                (formData.type.toString().length>0 && !(COMPLAINT_TYPE_ENUM.includes(formData.type)))?
                "Should match one of the "+  COMPLAINT_TYPE_ENUM.join(', ') : ""
            }
        />
        <TextField
            required
            name='urgency'
            label='urgency'
            variant='outlined'
            value={formData.urgency}
            onChange={handleChange}
            placeholder={"Any one of " + COMPLAINT_URGENCY_ENUM.join(', ')}
            error={(formData.urgency.toString().length>0 && !(COMPLAINT_URGENCY_ENUM.includes(formData.urgency)))}
            helperText={
                (formData.urgency.toString().length>0 && !(COMPLAINT_URGENCY_ENUM.includes(formData.urgency)))?
                "Should match one of the "+  COMPLAINT_URGENCY_ENUM.join(', ') : ""
            }
        />
        <Box
        sx={{
            display:'flex',
            justifyContent:'space-between'
        }}
        >
            {complaintPicture ?
                (<Typography
                    variant='caption'
                >
                    {complaintPicture.name}
                </Typography>)
                :
                
                    (<Typography
                        variant='caption'
                    >
                        Upload a photo of the issue*
                    </Typography>)
                
            }
            <Button
            variant='contained'
            component='label'
            sx={
                {
                    width:1.2/3,
                }
            }
            
            startIcon={<CloudUploadIcon/>}
        >
            <input
                type='file'
                name='complaintPicture'
                hidden
                onChange={handleFileChange}
                required
                
            />
            
        </Button>
            
        </Box>
        
    </Stack>
  )
}

export default Step1Complaint