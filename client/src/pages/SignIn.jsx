import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import apiClient from '../api/axios';
import { IconButton, InputAdornment } from '@mui/material';
import {Visibility, VisibilityOff} from '@mui/icons-material'
//for login
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [show, setShow] = useState(false);
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      setError('Both email and password is required');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/login', { email, password });
      const accessToken = response.data.data.accessToken;
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
      }

      if (response.data?.data?.user) {
        login(response.data.data.user);
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.status === 400) {
        setError('both email and password are required');
      } else if (error.status === 404) {
        setError('User not found, Please register and try login again');
      } else if (error.status === 403) {
        setError('Please verify your email before logging in.');
      } else if (error.status === 404) {
        setError('Invalid credentials');
      } else {
        setError('login failed, try again');
      }
      console.error('login error', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box
      sx={
        {
          // backgroundColor:'white',
        }
      }
      className="min-h-screen flex justify-center items-center"
    >
      <Paper
        sx={{
          borderRadius: '0.8rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem',
          width: {
            lg: '30rem',
            sm: '20rem',
          },
          marginX: 2,
        }}
        component={'form'}
        elevation={3}
        className="p-5 w-full max-w-md bg-[#f5f5f7]"
        onSubmit={handleSubmit}
      >
        <Typography
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '1.5rem',
            marginBottom: '1.5rem',
          }}
        >
          Sign In
        </Typography>

        <TextField
          required
          label="Email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
          variant="standard"
          sx={{
            width: 0.8,
          }}
          type='email'
          autoComplete='email'
        
        />

        <TextField
          required
          label="Password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="•••••••••••••"
          variant="standard"
          type={show ? "text" : "password"}
          sx={{
            width: 0.8,
          }}
          slotProps={{
            input:{
              endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={(e) => {
                  e.stopPropagation();
                  setShow((prev) => !prev);
                }} edge="end">
                  {show ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
            }
          }}
          autoComplete='current-password'
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
        >
          Log In
        </Button>
        {error.length > 0 && (
          <Typography
            variant="overline"
            sx={{
              color: 'red',
            }}
          >
            {error}
          </Typography>
        )}

        <Typography
          variant="caption"
          sx={{
            fontSize: '0.85rem',
          }}
        >
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-400 hover:underline ">
            Register Here
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default SignIn;
