import React, { useEffect, useState } from 'react';
import { Link as routerLink, useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Link from '@mui/material/Link';

import Step1Register from '../components/Step1Register';
import Step2Register from '../components/Step2Register';

const steps = ['Your Credentials', 'Address Details'];

function Register() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    locality: '',
    city: '',
    district: '',
    pinCode: '',
    state: '',
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  const handleFileChange = (e) => setProfilePicture(e.target.files[0]);

  const handleNext = () => {
    if (activeStep != 1) {
      setActiveStep((prev) => prev + 1);
    }
  };
  const handleBack = () => {
    if (activeStep != 0) {
      setActiveStep((prev) => prev - 1);
    }
  };
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Step1Register
            formData={formData}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
            profilePicture={profilePicture}
          />
        );
      case 1:
        return (
          <Step2Register formData={formData} handleChange={handleChange} />
        );
      default:
        throw new Error('unknown step');
    }
  };

  const handleSubmit = async () => {
    // event.preventDefault();

    setError('');
    
    const isEmptyField = Object.values(formData).some(value=>value.trim()==='');
    if(isEmptyField || !profilePicture){
        setError('All fields, including a profile picture, are required.');
        return;
    }
    setError('');
    setLoading(true);
    const dataToSubmit = new FormData();

    for(const key in formData){
        dataToSubmit.append(key, formData[key]);
    }
    dataToSubmit.append('profilePicture', profilePicture);


    try {
      const response = await apiClient.post('/register', dataToSubmit);

      if (response.status === 201) {
        alert('Registration Successful, you can now log in');
        navigate('/login');
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Registration failed please try again after some time'
      );
      console.error('Registration error', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box
      sx={{
        height: '100dvh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          borderRadius: '1rem',
          padding: '3rem',
          width: '30rem',
          margin: '1rem',
          minHeight: '38rem',
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          sx={{
            marginBottom: '1.2rem',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          Create an Account
        </Typography>

        <Stepper
          activeStep={activeStep}
          sx={{
            padding: '1rem',
          }}
        >
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (activeStep == steps.length - 1) {
              handleSubmit();
            }
          }}
        >
          {getStepContent(activeStep)}
          {error && <Typography color="error">{error}</Typography>}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: '0.5rem',
            }}
          >
            <Button
              color="inherit"
              disabled={activeStep == 0}
              onClick={handleBack}
              sx={{
                mr: 1,
              }}
            >
              Back
            </Button>

            <Box sx={{ flex: '1 1 auto' }}>
              {activeStep === steps.length - 1 ? (
                <Button type="submit" variant="contained" disabled={loading} loading={loading} loadingPosition='end' >
                  {loading ? 'Registering...' : 'Finish'}
                </Button>
              ) : (
                <Button onClick={handleNext} variant="contained">
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </form>

        <Typography
          variant="caption"
          sx={{
            fontSize: '0.85rem',
          }}
        >
          Already have an account?{' '}
          <Link component={routerLink} to="/login">
            Sign in here
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Register;
