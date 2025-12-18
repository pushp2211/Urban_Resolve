import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Link} from 'react-router-dom';
import apiClient from '../api/axios';
//for reset password
import { useNavigate } from 'react-router-dom';
import LogoAndName from '../Logo/LogoAndName';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [helperText, setHelperText] = useState('');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
    

    const handleSubmit = async(e)=>{
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const response = await apiClient.post(`/service/forgot-password`, {
                email
            });
            // console.log(response);
            if(response.status === 200){
                setSuccess(true);
            }
            
        } catch (error) {
            console.log(error);
            setError(error?.response?.data?.message || "Something went wrong");
        }
        finally{
            setLoading(false);
        }
    }
  return (
    <Box
      sx={
        {
          // backgroundColor:'white',
          minHeight:'100svh',
          display:"flex",
          justifyContent:"center",
          alignItems:"center",
          flexDirection:"column",
          gap:2
        }
      }
      // className="min-h-screen flex justify-center items-center"
    >
      <LogoAndName/>
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
            xs:"22rem"
          },
          marginX: 2,
          paddingY:4,
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
            display:"flex",
            flexDirection:"column"
            // marginBottom: '1.5rem',
          }}
        >
          Reset Password
          <Typography variant='caption'>
            Enter your registered email
          </Typography>
        </Typography>
        <TextField
          required
          label="Email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        //   variant="standard"
          type="text"
          sx={{
            width: 0.8,
          }}
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
            Reset
        </Button>
        {error.length > 0 && (
          <Typography
            variant="overline"
            sx={{
              color: 'red',
              textAlign:"center"
            }}
          >
            {error}
          </Typography>
        )}
        {( success &&
          <Typography
            variant="caption"
            sx={{
              color: 'green',
              textAlign:"center",
              paddingX:5
            }}
          >
            Check your email for the reset link.
            Don't forget to check the spam folder
          </Typography>
        )}

        <Typography
          variant="caption"
          sx={{
            fontSize: '0.85rem',
            display:"flex",
            flexDirection:"row",
            gap:1
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

export default ForgotPassword;
