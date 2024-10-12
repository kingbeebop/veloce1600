"use client"

import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  TextField,
  Typography,
  Modal,
  Backdrop,
  Fade,
  Alert,
} from '@mui/material'; // Import MUI components
import { loginUser, refreshToken, selectAuth } from '../redux/slices/authSlice';
import { fetchProtectedData } from '../utils/api';

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>(''); // Email state for modal
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const auth = useSelector(selectAuth);

  // Handle user login
  const handleLogin = useCallback(async () => {
    try {
      const action = await dispatch(loginUser({ username, password })).unwrap();
      if (action) {
        router.push('/cars');
      }
    } catch (error) {
      console.error('Login failed:', error instanceof Error ? error.message : 'Unknown error');
    }
  }, [dispatch, username, password, router]);

  // Auto-login logic using tokens
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshTokenValue = localStorage.getItem('refreshToken');

    const tryAutoLogin = async () => {
      if (accessToken) {
        await fetchProtectedData(); // Assuming fetchProtectedData will manage the session
      } else if (refreshTokenValue) {
        await handleRefreshToken();
      }
    };

    tryAutoLogin();
  }, []);

  // Handle token refresh
  const handleRefreshToken = useCallback(async () => {
    try {
      const action = await dispatch(refreshToken()).unwrap();
      if (action) {
        await fetchProtectedData(); // Re-fetch protected data after refreshing token
      }
    } catch (refreshError) {
      console.error('Token refresh failed:', refreshError instanceof Error ? refreshError.message : 'Unknown error');
    }
  }, [dispatch]);

  // Forgot password modal submission (placeholder logic for now)
  const handleForgotPasswordSubmit = () => {
    console.log('Forgot Password logic to be implemented');
    setModalOpen(false); // Close the modal after submission (for now, nothing happens)
    setEmail(''); // Clear the email state
  };

  return (
    <Box maxWidth="400px" mx="auto" mt={10} p={5} borderRadius="8px" boxShadow={3}>
      <Typography variant="h4" align="center" gutterBottom>
        Login
      </Typography>
      <TextField
        fullWidth
        label="Username"
        variant="outlined"
        required
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        variant="outlined"
        required
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {auth.error && <Alert severity="error">{auth.error}</Alert>}
      <Button variant="contained" color="primary" onClick={handleLogin} fullWidth>
        Login
      </Button>
      <Button variant="text" onClick={() => setModalOpen(true)} fullWidth>
        Forgot username or password?
      </Button>

      {/* Forgot Password Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={modalOpen}>
          <Box
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
              width: '300px',
              margin: 'auto',
              marginTop: '20%',
            }}
          >
            <Typography variant="h6">Forgot Username or Password?</Typography>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              variant="outlined"
              required
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Update state on change
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleForgotPasswordSubmit}
              fullWidth
            >
              Submit
            </Button>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default Login;
