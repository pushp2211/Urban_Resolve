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
import { sendNotification } from '../api/notificationApi';
import { fetchAddressDetails } from '../../utils/pincodeToAddress';
const steps = ['Credentials', 'Address Details'];

function Register() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [step1Error, setStep1Error] = useState(true);
  const [step2Error, setStep2Error] = useState(true);
  
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
  const [addressLoading, setAddressLoading] = useState(true);
  const [verifyPass, setVerifyPass] = useState("");
  const [passwordNotMatch, setPasswordNotMatch] = useState(true);

  useEffect(()=>{
    if(verifyPass.length===0) return;
    if(formData.password.length===0) return;

    const check = ()=>{
      if(verifyPass!=formData.password){
        setPasswordNotMatch(true);
      }
      else{
        setPasswordNotMatch(false);
      }
    }
    check();
  }, [formData.password, verifyPass])

  useEffect(() => {
    if(formData.pinCode.length != 6){
        return;
      }
    const fetchAddressDetail = async () => {
      setError('');
      if(activeStep!=1) return;
      if(formData.pinCode.length===0) return;
      setAddressLoading(true);
      try {
        const response = await fetchAddressDetails(formData.pinCode);
        const data = response[0];
      //if(response.sta)
      // if(!response.status !== "Success"){
      //   setError("Invalid pincode");
      // }
      
      if(data.Status !== "Success"){
        setError("Enter a valid pincode");
        return;
      }
      setError("");
      const city = data.PostOffice[0].Region;
      const state = data.PostOffice[0].State;
      const district = data.PostOffice[0].District;
      setFormData({
        ...formData,
        ["city"] : city,
        ["state"] : state,
        ["district"] : district
      })

      console.log(data);
      } catch (error) {
        setError("Retry entering the pincode");
      }
      finally{
        setAddressLoading(false);
      }
    };
    fetchAddressDetail();
  }, [formData.pinCode]);

  useEffect(() => {
    if (activeStep == 0) {
      if (
        !formData ||
        formData?.fullName.toString().trim() == '' ||
        formData?.email.toString().trim() === '' ||
        !profilePicture ||
        passwordNotMatch
      ) {
        setStep1Error(true);
      } else {
        setStep1Error(false);
      }
    } else if (activeStep == 1) {
      if (
        !formData ||
        (formData?.pinCode.toString().length > 0 &&
          formData?.pinCode.toString().length != 6) ||
        formData?.city.toString().trim().length == 0 ||
        formData?.locality.toString().trim().length == 0 ||
        formData?.district.toString().trim().length == 0 ||
        formData?.state.toString().trim().length == 0
      ) {
        setStep2Error(true);
      } else {
        setStep2Error(false);
        setError("");
      }
    }
  }, [formData, profilePicture, passwordNotMatch]);

  const handleChange = (e) =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const maxSize = 400 * 1024; //400 kb
    if (file.size > maxSize) {
      setError('Image size must be less than 400KB');
      e.target.value = '';
      return;
    }
    setError('');
    setProfilePicture(e.target.files[0]);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (activeStep != 1) {
      setActiveStep((prev) => prev + 1);
      //setStep2Error(true); /////////////
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
            setPasswordNotMatch = {setPasswordNotMatch}
            setVerifyPass={setVerifyPass}
            verifyPass = {verifyPass}
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

  const handleSubmit = async (e) => {
    // event.preventDefault();
    setError('');

    const isEmptyField = Object.values(formData).some(
      (value) => value.trim() === ''
    );
    if (isEmptyField || !profilePicture) {
      setError('All fields, including a profile picture, are required.');
      return;
    }
    setError('');
    setLoading(true);
    const dataToSubmit = new FormData();

    for (const key in formData) {
      dataToSubmit.append(key, formData[key]);
    }
    dataToSubmit.append('profilePicture', profilePicture);

    try {
      const response = await apiClient.post('/register', dataToSubmit);

      if (response.status === 201) {
        alert(
          `Registration Successful, after verifying your email ${formData.email} you can now log in
           "DON'T FORGET TO CHECK YOUR SPAM FOLDER"
          `
        );
        navigate('/login');
      }
    } catch (error) {
      console.log(error);
      setError(error.response.data.message)
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
        flexDirection:"column"
      }}
    >
      <Typography variant='overline'
        sx={{
          fontWeight:"bold",
          fontSize:"1rem"
        }}
      
      >
        Urban Resolve
      </Typography>
      <Paper
        elevation={3}
        sx={{
          borderRadius: '1rem',
          padding: '2rem',
          width: {
            lg: '26rem',
            sm: '25rem',
            
          },
          margin: '0.5rem',
          minHeight: {
            lg: '35rem',
            sm: '34rem',
          },
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          sx={{
            marginBottom: '1.2rem',
            fontWeight: 'bold',
            textAlign: 'center',
            display:"flex",
            flexDirection:"column"

          }}
        >
          Create an account
          {activeStep==0 && <Typography variant='caption'>
            Sign up with your email
          </Typography>}
          {activeStep==1 && <Typography variant='caption'>
            Enter your address details
          </Typography>}
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
          // onSubmit={(e) => {
          //   e.preventDefault();
          //   if (activeStep == steps.length - 1) {
          //     // handleSubmit();
          //   }
          // }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
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
              type="button"
              sx={{
                mr: 1,
              }}
            >
              Back
            </Button>

            <Box sx={{ flex: '1 1 auto' }}>
              {activeStep === steps.length - 1 ? (
                <Button
                  type="button"
                  variant="contained"
                  disabled={loading || step2Error}
                  loading={loading}
                  loadingPosition="end"
                  onClick={(e) => {
                    e.preventDefault();
                    if (activeStep === steps.length - 1) {
                      handleSubmit();
                    }
                  }}
                >
                  {loading ? 'Registering...' : 'Finish'}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  variant="contained"
                  disabled={step1Error}
                  type="button"
                >
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
            width:"100%",
            textAlign:"center",
            display:"flex",
            gap:1,
            justifyContent:"center",
            marginY:1
          }}
        >
          Already have an account?
          <Link component={routerLink} to="/login">
            Sign in
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Register;
