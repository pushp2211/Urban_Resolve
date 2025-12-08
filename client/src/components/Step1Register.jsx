import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Box from '@mui/material/Box';
import { IconButton } from '@mui/material';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import { InputAdornment } from '@mui/material';

function Step1Register({
  formData,
  handleChange,
  handleFileChange,
  profilePicture,
  setPasswordNotMatch,
  setVerifyPass,
  verifyPass
}) {
  const [show, setShow] = useState(false);

  const [showPass2, setShowPass2] = useState(false);

//   useEffect(() => {
//     const checkPassMatch = () => {
//       if (formData.password !== pass2) {
//         setPasswordNotMatch(true);
//       } else {
//         setPasswordNotMatch(false);
//       }
//     };
//     checkPassMatch();
//   }, [pass2, formData.password]);
  return (
    <Stack
      sx={{
        gap: 2,
        marginBottom: '1rem',
      }}
    >
      <TextField

        required
        name="fullName"
        label="Full Name"
        value={formData.fullName}
        onChange={handleChange}
        variant='standard'
      />
      <TextField
        required
        name="email"
        label="Email"
        value={formData.email}
        onChange={handleChange}
        variant='standard'
      />
      <TextField
        type={show ? 'text' : 'password'}
        required
        name="password"
        label="Password"
        variant='standard'
        value={formData.password}
        onChange={handleChange}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setShow((prev) => !prev);
                  }}
                  edge="end"
                >
                  {show ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
      <TextField
        type={showPass2 ? 'text' : 'password'}
        required
        name="password"
        label="Confirm Password"
        variant='standard'
        value={verifyPass}
        onChange={(e) => {
          setVerifyPass(e.target.value);
        }}
        helperText={
          verifyPass.length > 0 && verifyPass !== formData.password
            ? 'Password does not match'
            : ''
        }
        error={verifyPass.length > 0 && formData.password !== verifyPass}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPass2((prev) => !prev);
                  }}
                  edge="end"
                >
                  {showPass2 ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {profilePicture ? (
          <Typography variant="caption">{profilePicture.name}</Typography>
        ) : (
          <Typography variant="caption">Upload Profile Picture*</Typography>
        )}
        <Button
          variant="contained"
          component="label"
          sx={{
            width: 1.2 / 3,
          }}
          type="button"
          startIcon={<CloudUploadIcon />}
        >
          <input
            type="file"
            name="profilePicture"
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

export default Step1Register;
