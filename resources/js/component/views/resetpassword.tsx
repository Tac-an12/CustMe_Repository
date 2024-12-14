import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, CircularProgress, Container, Typography, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import apiService from '../services/apiService';

const ResetPassword = () => {
  const location = useLocation();
  const { token } = useParams(); // Get the token from the URL parameter
  const navigate = useNavigate();

  // Extract email from the query parameters
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email');

  useEffect(() => {
    if (!token || !email) {
      console.error('Missing token or email in the URL');
    }
  }, [token, email]);

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const validatePassword = (password) => {
    const alphanumericRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
    return alphanumericRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate password complexity
    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long and include letters and numbers.');
      setLoading(false);
      return;
    }

    if (password !== passwordConfirmation) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const response = await apiService.post('/reset-password', {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      if (response.status === 200) {
        setMessage('Password reset successfully!');
        setLoading(false);
        navigate('/login');
      } else {
        setError(response.data.message || 'Error resetting password.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Reset Password Error: ', err);
      setError('Error resetting password. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" className="mt-12 p-6 bg-white shadow-lg rounded-lg">
      <Typography variant="h4" className="text-center mb-6">Reset Password</Typography>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <TextField
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="text-lg"
            error={!!error && !validatePassword(password)}
            helperText={
              !!error && !validatePassword(password)
                ? 'Password must be at least 8 characters long and include letters and numbers.'
                : ''
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className="mb-4">
          <TextField
            label="Confirm Password"
            type={showPasswordConfirmation ? 'text' : 'password'}
            variant="outlined"
            fullWidth
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
            className="text-lg"
            error={!!error && password !== passwordConfirmation}
            helperText={
              !!error && password !== passwordConfirmation
                ? 'Passwords do not match.'
                : ''
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)} edge="end">
                    {showPasswordConfirmation ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className="flex justify-center mt-6">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            className="text-lg py-2"
          >
            {loading ? <CircularProgress size={24} color="secondary" /> : 'Reset Password'}
          </Button>
        </div>
      </form>
      {message && <div className="text-green-500 mt-4 text-center">{message}</div>}
      {error && <div className="text-red-500 mt-4 text-center">{error}</div>}
    </Container>
  );
};

export default ResetPassword;
