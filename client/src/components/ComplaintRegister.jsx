import React, { useEffect, useState } from 'react';
import { Link as routerLink, useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import Step1Complaint from './Step1Complaint';
import Step2Complaint from './Step2Complaint';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Link from '@mui/material/Link';
import { fetchAddressDetails } from '../../utils/pincodeToAddress';
import { COMPLAINT_URGENCY_ENUM } from '../../enum/ComplaintUrgency';
import { COMPLAINT_TYPE_ENUM } from '../../enum/ComplaintType';
import { Grow } from '@mui/material';
const steps = ['Your Credentials', 'Address Details'];

function ComplaintRegister({ handleClose }) {
  const [activeStep, setActiveStep] = useState(0);
  const [step1Error, setStep1Error] = useState(true);
    const [step2Error, setStep2Error] = useState(true);
  const [addressLoading, setAddressLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    urgency: '',
    locality: '',
    city: '',
    district: '',
    pinCode: '',
    state: '',
  });

  const [complaintPicture, setComplaintPicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
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
        if(formData.pinCode.length != 6){
          return;
        }
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
  
        // console.log(data);
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
        formData?.title.toString().trim() == '' ||
        formData?.description.toString().trim() === '' ||
        !complaintPicture ||
        formData?.type.toString().trim() === '' ||
        !COMPLAINT_TYPE_ENUM.includes(formData.type.toString().trim()) ||
        formData?.urgency.toString().trim() == '' ||
        !COMPLAINT_URGENCY_ENUM.includes(formData?.urgency.toString().trim())
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
      }
    }
  }, [formData, complaintPicture]);

  const handleChange = (e) =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  const handleFileChange = (e) => setComplaintPicture(e.target.files[0]);

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
          <Step1Complaint
            formData={formData}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
            complaintPicture={complaintPicture}
          />
        );
      case 1:
        return (
          <Step2Complaint formData={formData} handleChange={handleChange} />
        );
      default:
        throw new Error('unknown step');
    }
  };

  const handleSubmit = async () => {
    // event.preventDefault();

    setError('');

    const isEmptyField = Object.values(formData).some(
      (value) => value.trim() === ''
    );
    if (isEmptyField || !complaintPicture) {
      setError('All fields, including a complaint picture, are required.');
      return;
    }
    if (!COMPLAINT_TYPE_ENUM.includes(formData.type)) {
      setError('Complaint type must be of ' + COMPLAINT_TYPE_ENUM.join(', '));
    }
    if (!COMPLAINT_URGENCY_ENUM.includes(formData.urgency)) {
      setError(
        'Complaint type must be of ' + COMPLAINT_URGENCY_ENUM.join(', ')
      );
    }
    setError('');
    setLoading(true);
    const dataToSubmit = new FormData();

    for (const key in formData) {
      dataToSubmit.append(key, formData[key]);
    }
    dataToSubmit.append('photo', complaintPicture);

    try {
      const response = await apiClient.post(
        '/complaint/uploadComplaint',
        dataToSubmit
      );

      if (response.status === 201) {
        alert('Complaint uploaded successfully');
        handleClose();
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Upload failed please try again after some time'
      );
      console.error('Complaint upload error', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box
      sx={{
        // height: '100dvh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          borderRadius: '1rem',
          padding: '2rem',
          width: {
            lg: '30rem',
            sm: '25rem',
          },

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
          Register Complaint
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

        <form>
          {getStepContent(activeStep)}
          {error && <Typography color="error">{error}</Typography>}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: '0.5rem',
              justifyContent: 'space-between',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <Button
                color="inherit"
                disabled={activeStep == 0}
                onClick={handleBack}
                sx={{
                  mr: 1,
                }}
                type='button'
              >
                Back
              </Button>

              <Box sx={{ flex: '1 1 1' }}>
                {activeStep === steps.length - 1 ? (
                  <Button
                    type="button"
                    variant="contained"
                    disabled={loading || step2Error||addressLoading}
                    loading={loading}
                    loadingPosition="end"
                    onClick={(e) => {
                      e.preventDefault();
                      if (activeStep == steps.length - 1) {
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
                    type='button'
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
            <Button onClick={handleClose}>close</Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

export default ComplaintRegister;
