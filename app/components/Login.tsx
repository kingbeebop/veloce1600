import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { loginUser, refreshToken, selectAuth } from '../redux/slices/authSlice';
import { fetchProtectedData } from '../utils/api';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>(''); // Email state for modal
  const auth = useSelector(selectAuth);

  // Login user after checking tokens
  const handleLoginUser = useCallback(async () => {
    try {
      const userDetails = await fetchProtectedData();
      const action = await dispatch(loginUser({ username: userDetails.username, password: '' })).unwrap();
      if (action) {
        router.push('/cars');
      }
    } catch (error) {
      console.error('Login user failed:', error instanceof Error ? error.message : 'Unknown error');
    }
  }, [dispatch, router]);

  // Handle token refresh
  const handleRefreshToken = useCallback(async () => {
    try {
      const action = await dispatch(refreshToken()).unwrap();
      if (action) {
        await handleLoginUser();
      }
    } catch (refreshError) {
      console.error('Token refresh failed:', refreshError instanceof Error ? refreshError.message : 'Unknown error');
    }
  }, [dispatch, handleLoginUser]);

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
        await handleLoginUser();
      } else if (refreshTokenValue) {
        await handleRefreshToken();
      }
    };

    tryAutoLogin();
  }, [handleLoginUser, handleRefreshToken]);

  // Forgot password modal submission (placeholder logic for now)
  const handleForgotPasswordSubmit = () => {
    console.log('Forgot Password logic to be implemented');
    onClose(); // Close the modal after submission (for now, nothing happens)
    setEmail(''); // Clear the email state
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={5} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <Text fontSize="2xl" mb={4} textAlign="center">Login</Text>
      <FormControl isRequired mb={4}>
        <FormLabel>Username</FormLabel>
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
        />
      </FormControl>
      <FormControl isRequired mb={4}>
        <FormLabel>Password</FormLabel>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
      </FormControl>
      {auth.error && <Text color="red.500">{auth.error}</Text>}
      <Button colorScheme="blue" onClick={handleLogin} width="full">Login</Button>
      <Text textAlign="center" mt={4}>
        <Button variant="link" onClick={onOpen}>Forgot username or password?</Button>
      </Text>

      {/* Forgot Password Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Forgot Username or Password?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="email" isRequired>
              <FormLabel>Email Address</FormLabel>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Update state on change
              />
            </FormControl>
            <Button mt={4} colorScheme="blue" width="full" onClick={handleForgotPasswordSubmit}>
              Submit
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Login;
