import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'
import apiClient from '../api/axios'

//for login
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'



function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const {user, login} = useAuth();
  const navigate = useNavigate();

  useEffect(()=>{
    if(user){
      navigate('/');
    }
  }, [navigate])


  const handleSubmit = async(event)=>{
    event.preventDefault();
    if(!email || !password){
      setError('Both email and password is required');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/login', {email, password});

      if(response.data?.data?.user){
        login(response.data.data.user);
        navigate('/');
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed please check your credentials")
      console.error("login error", error);
    }
    finally{
      setLoading(false);
    }
  }
  return (
    <Box
      sx={{
        // backgroundColor:'white',
      }}
      className="min-h-screen flex justify-center items-center"
    >
      <Paper
        sx={{
          borderRadius:'0.8rem',
          display:'flex',
          flexDirection:'column',
          justifyContent:'center',
          alignItems:'center',
          gap:'1rem'

        }}
        component={'form'}
        elevation={3}
        className='p-5 w-full max-w-md bg-[#f5f5f7]'
        onSubmit={handleSubmit}
      >
        <Typography
          sx={{
            textAlign:'center',
            fontWeight:'bold',
            fontSize:'1.5rem',
            marginBottom:'1.5rem'
          }}
        >
          Sign In
        </Typography>

          <TextField
            required
            label="Email"
            id='email'
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            placeholder='example@gmail.com'
            variant='standard'
            sx={{
              width:0.8
            }}
          />

          <TextField
            required
            label="Password"
            id='password'
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            placeholder='•••••••••••••'
            variant='standard'
            sx={{
              width:0.8
            }}
          />

          <Button
            loading={loading}
            loadingPosition='start'
            type='submit'
            variant='contained'
            size='large'
            sx={{
              marginTop:'2rem'
            }}
          >
            Log In
          </Button>
          {error.length>0 &&
            <Typography
              variant='overline'
              sx={{
                color:'red'
              }}
            >
              {error}
            </Typography>
          }

            <Typography
              variant='caption'
              sx={{
                fontSize:'0.85rem'
              }}
            >
              Don't have an account? {' '}
              <Link to='/register' className='text-blue-400 hover:underline '>
                Register Here
              </Link>
            </Typography>

      </Paper>

      
    </Box>
  )
}

export default SignIn