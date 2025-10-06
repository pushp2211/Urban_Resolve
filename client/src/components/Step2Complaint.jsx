import React from 'react'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'


function Step2Complaint({formData, handleChange}) {

  return (
    <Stack
        sx={{
            gap:2,
            marginBottom:'1rem'
        }}
    >
        <TextField
            name='locality'
            label='Locality'
            variant='outlined'
            required
            value={formData.locality}
            onChange={handleChange}
        />
        <TextField
            name='city'
            label='City'
            variant='outlined'
            required
            value={formData.city}
            onChange={handleChange}
        />
        <TextField
            name='district'
            label='District'
            variant='outlined'
            required
            value={formData.district}
            onChange={handleChange}
        />
        
        <TextField
            name='pinCode'
            label='Pin Code'
            variant='outlined'
            required
            value={formData.pinCode}
            onChange={handleChange}
        />
        <TextField
            name='state'
            label='State'
            variant='outlined'
            required
            value={formData.state}
            onChange={handleChange}
        />
    </Stack>
  )
}

export default Step2Complaint