import React, { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { fetchAddressDetails } from '../../utils/pincodeToAddress';

function Step2Register({ formData, handleChange }) {
  
  return ( 
    <Stack
      sx={{
        gap: 2,
        marginBottom: '1rem',
      }}
    >
      <TextField
        name="locality"
        label="Locality"
        variant='standard'
        required
        value={formData.locality}
        onChange={handleChange}
      />
      <TextField
        name="pinCode"
        label="Pin Code"
        variant='standard'
        required
        value={formData.pinCode}
        onChange={handleChange}
        error={
          formData.pinCode.toString().length > 0 &&
          formData.pinCode.toString().length != 6
        }
        helperText={
          formData.pinCode.toString().length > 0 &&
          formData.pinCode.toString().length != 6
            ? 'Pin code must be of 6 digits'
            : ''
        }
      />
      <TextField
        name="city"
        label="City"
        variant='standard'
        required
        value={formData.city}
        onChange={handleChange}
        slotProps={{
          input:{
            readOnly:true
          }
        }}
      />
      <TextField
        name="district"
        label="District"
        variant='standard'
        required
        value={formData.district}
        onChange={handleChange}
        slotProps={{
          input:{
            readOnly:true
          }
        }}
      />
      
      <TextField
        name="state"
        label="State"
        variant='standard'
        required
        value={formData.state}
        onChange={handleChange}
        slotProps={{
          input:{
            readOnly:true
          }
        }}
      />
    </Stack>
  );
}

export default Step2Register;
