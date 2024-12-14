import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { TextField, Button, Typography, Box } from '@mui/material';
import apiService from '../services/apiService';

const EmailVerification = () => {
  const { id, hash } = useParams(); // Extract user ID and hash from the URL parameters
  const [verificationCode, setVerificationCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Send the verification code to your API for verification
    try {
      const response = await apiService.post('/verify-email', {
        id,
        hash,
        verification_code: verificationCode,
      });

      setSuccessMessage('Email verified successfully!');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Invalid verification code or verification failed.');
      setSuccessMessage('');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: '0 auto', padding: 3 }}>
      <Typography variant="h5" gutterBottom>Email Verification</Typography>
      <Typography variant="body1" paragraph>
        Please enter the 6-digit code sent to your email.
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <TextField
          label="Verification Code"
          variant="outlined"
          fullWidth
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          required
          sx={{ marginBottom: 2 }}
        />
        
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Verify
        </Button>
      </form>

      {errorMessage && <Typography color="error" variant="body2" sx={{ marginTop: 2 }}>{errorMessage}</Typography>}
      {successMessage && <Typography color="success" variant="body2" sx={{ marginTop: 2 }}>{successMessage}</Typography>}
    </Box>
  );
};

export default EmailVerification;
