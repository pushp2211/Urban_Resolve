import React, {useEffect} from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Box from '@mui/material/Box'
function Step1Register({formData, handleChange, handleFileChange, profilePicture}) {
  return (
    <Stack
        sx={{
            gap:2,
            marginBottom:'1rem'
        }}
    >
        <TextField
            required
            name='fullName'
            label='Full Name'
            variant='outlined'
            value={formData.fullName}
            onChange={handleChange}
            
        />
        <TextField
            required
            name='email'
            label='Email'
            variant='outlined'
            value={formData.email}
            onChange={handleChange}
        />
        <TextField
            required
            name='password'
            label='Password'
            variant='outlined'
            value={formData.password}
            onChange={handleChange}
        />
        <Box
        sx={{
            display:'flex',
            justifyContent:'space-between'
        }}
        >
            {profilePicture ?
                (<Typography
                    variant='caption'
                >
                    {profilePicture.name}
                </Typography>)
                :
                
                    (<Typography
                        variant='caption'
                    >
                        Upload Profile Picture*
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
                name='profilePicture'
                hidden
                onChange={handleFileChange}
                required
                
            />
            
        </Button>
            
        </Box>
        
    </Stack>
  )
}

export default Step1Register