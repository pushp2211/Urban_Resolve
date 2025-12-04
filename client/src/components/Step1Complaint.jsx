import React, { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Box from '@mui/material/Box';
import { COMPLAINT_TYPE_ENUM } from '../../enum/ComplaintType';
import { COMPLAINT_URGENCY_ENUM } from '../../enum/ComplaintUrgency';

function Step1Complaint({
  formData,
  handleChange,
  handleFileChange,
  complaintPicture,
}) {
  // title, description, type, locality, district, city, pinCode, state,  urgency
  const urgency = [
    {
      value: 'Low',
      label: 'Low',
    },
    {
      value: 'High',
      label: 'High',
    },
    {
      value: 'Medium',
      label: 'Medium',
    },
  ];
  const type = [
    {
      value: 'Water',
      label: 'Water',
    },
    {
      value: 'Electricity',
      label: 'Electricity',
    },
    {
      value: 'Garbage',
      label: 'Garbage',
    },
    {
      value: 'Road',
      label: 'Road',
    },
    {
      value: 'Other',
      label: 'Other',
    },
  ];

  return (
    <Stack
      sx={{
        gap: 2,
        marginBottom: '1rem',
      }}
    >
      <TextField
        required
        name="title"
        label="Title"
        variant="outlined"
        value={formData.title}
        onChange={handleChange}
      />
      <TextField
        required
        name="description"
        label="Description"
        variant="outlined"
        value={formData.description}
        onChange={handleChange}
      />
      <TextField
        required
        name="type"
        variant="outlined"
        value={formData.type}
        onChange={handleChange}
        placeholder={'Any one of ' + COMPLAINT_TYPE_ENUM.join(', ')}
        error={
          formData.type.toString().length > 0 &&
          !COMPLAINT_TYPE_ENUM.includes(formData.type)
        }
        helperText={
          formData.type.toString().length > 0 &&
          !COMPLAINT_TYPE_ENUM.includes(formData.type)
            ? 'Should match one of the ' + COMPLAINT_TYPE_ENUM.join(', ')
            : ''
        }
        select
        slotProps={{
          select: {
            native: true,
          },
        }}
      >
        <option value="" disabled>Select Category</option>
        {type.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </TextField>
      <TextField
        required
        name="urgency"
        variant="outlined"
        value={formData.urgency}
        onChange={handleChange}
        placeholder={'Any one of ' + COMPLAINT_URGENCY_ENUM.join(', ')}
        error={
          formData.urgency.toString().length > 0 &&
          !COMPLAINT_URGENCY_ENUM.includes(formData.urgency)
        }
        helperText={
          formData.urgency.toString().length > 0 &&
          !COMPLAINT_URGENCY_ENUM.includes(formData.urgency)
            ? 'Should match one of the ' + COMPLAINT_URGENCY_ENUM.join(', ')
            : ''
        }
        select
        slotProps={{
          select: {
            native: true,
          },
        }}
      >
        <option value="" disabled>Select urgency</option>
        {urgency.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </TextField>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {complaintPicture ? (
          <Typography variant="caption">{complaintPicture.name}</Typography>
        ) : (
          <Typography variant="caption">
            Upload a photo of the issue*
          </Typography>
        )}
        <Button
          variant="contained"
          component="label"
          sx={{
            width: 1.2 / 3,
          }}
          startIcon={<CloudUploadIcon />}
        >
          <input
            type="file"
            name="complaintPicture"
            hidden
            onChange={handleFileChange}
            required
            accept="image/*"
          />
        </Button>
      </Box>
    </Stack>
  );
}

export default Step1Complaint;
