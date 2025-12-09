import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import apiClient from '../api/axios';
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
//for reset password
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [helperText, setHelperText] = useState('');
  const [show, setShow] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (confirmPassword !== password) {
      setHelperText('Confirm password does not match');
    } else {
      setHelperText('');
    }
  }, [confirmPassword, password]);

  const { resetToken } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      setError('password length must me more than 8');
      return;
    }
    setError('');
    setLoading(true);

    if (!resetToken) {
      setError('Invalid reset link');
      return;
    }
    try {
      const response = await apiClient.post(
        `/service/reset-password/${resetToken}`,
        {
          password,
        }
      );
      console.log(response);
      if (response.status === 200) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        setSuccess(true);
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (error) {
      console.log(error);
      setError(error?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box
      sx={{
        // backgroundColor:'white',
        minHeight: '100svh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 2,
      }}
      // className="min-h-screen flex justify-center items-center"
    >
      <Typography
        variant="overline"
        sx={{
          fontWeight: 'bold',
          fontSize: '1rem',
        }}
      >
        Urban Resolve
      </Typography>
      <Paper
        sx={{
          borderRadius: '0.8rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem',
          width: {
            lg: '24rem',
            sm: '23rem',
            xs: '22rem',
          },
          marginX: 2,
          paddingY: 4,
        }}
        component={'form'}
        elevation={3}
        // className="p-5 w-full max-w-md bg-[#f5f5f7]"
        onSubmit={handleSubmit}
      >
        <Typography
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            // marginBottom: '1.5rem',
          }}
        >
          Reset Password
          <Typography variant="caption">Enter new password</Typography>
        </Typography>

        <TextField
          required
          label="Password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="•••••••••••••"
          variant="standard"
          type={show ? 'text' : 'password'}
          sx={{
            width: 0.8,
          }}
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
          required
          label="Confirm Password"
          id="confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="•••••••••••••"
          variant="standard"
          type={showConfirmPass ? 'text' : 'password'}
          sx={{
            width: 0.8,
          }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowConfirmPass((prev) => !prev);
                    }}
                    edge="end"
                  >
                    {showConfirmPass ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          error={helperText?.length > 0}
          helperText={helperText?.length > 0 ? helperText : ''}
        />

        <Button
          loading={loading}
          loadingPosition="start"
          type="submit"
          variant="contained"
          size="large"
          sx={{
            marginTop: '2rem',
          }}
          disabled={helperText?.length > 0}
        >
          Reset
        </Button>
        {error.length > 0 && (
          <Typography
            variant="overline"
            sx={{
              color: 'red',
              textAlign: 'center',
            }}
          >
            {error}
          </Typography>
        )}
        {success && (
          <Typography
            variant="caption"
            sx={{
              color: 'green',
              textAlign: 'center',
            }}
          >
            Password reset successful, redirecting to login
          </Typography>
        )}

        <Typography
          variant="caption"
          sx={{
            fontSize: '0.85rem',
            display: 'flex',
            flexDirection: 'row',
            gap: 1,
          }}
        >
          Login here
          <Link to="/login" className="text-blue-400 hover:underline ">
            Login
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default ResetPassword;
