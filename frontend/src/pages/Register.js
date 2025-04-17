// src/pages/Register.js
import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Text,
  VStack,
  Heading,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    re_password: '',
    agree: false,
  });
  const [errors, setErrors] = useState({});
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const boxBg = useColorModeValue('white', 'gray.800');

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = t('register.errors.username', 'Username is required');
    if (!formData.email) newErrors.email = t('register.errors.email', 'Email is required');
    if (!formData.password) newErrors.password = t('register.errors.password', 'Password is required');
    if (formData.password !== formData.re_password)
      newErrors.re_password = t('register.errors.re_password', 'Passwords do not match');
    if (!formData.agree) newErrors.agree = t('register.errors.agree', 'You must agree to the terms');
    return newErrors;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await axios.post(
        'http://localhost:8000/api/auth/users/',
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          re_password: formData.re_password,
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      toast({
        title: t('register.success', 'Registration successful'),
        description: t('register.success_message', 'Please check your email to activate your account.'),
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error.response || error.message);
      toast({
        title: t('register.error', 'Registration failed'),
        description:
          error.response?.data?.detail ||
          Object.values(error.response?.data || {}).join(', ') ||
          t('register.error_message', 'Please try again.'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={6} bg={bgColor} minH="100vh">
      <Box maxW="md" mx="auto" p={6} bg={boxBg} borderRadius="md" shadow="md">
        <Heading mb={6} textAlign="center">
          {t('register.title', 'Register')}
        </Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired isInvalid={errors.username}>
              <FormLabel>{t('register.username', 'Username')}</FormLabel>
              <Input
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Veronika3"
              />
              {errors.username && <Text color="red.500">{errors.username}</Text>}
            </FormControl>
            <FormControl isRequired isInvalid={errors.email}>
              <FormLabel>{t('register.email', 'Email')}</FormLabel>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="mercynash@inbox.ru"
              />
              {errors.email && <Text color="red.500">{errors.email}</Text>}
            </FormControl>
            <FormControl isRequired isInvalid={errors.password}>
              <FormLabel>{t('register.password', 'Password')}</FormLabel>
              <Input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
              {errors.password && <Text color="red.500">{errors.password}</Text>}
            </FormControl>
            <FormControl isRequired isInvalid={errors.re_password}>
              <FormLabel>{t('register.confirm_password', 'Confirm Password')}</FormLabel>
              <Input
                name="re_password"
                type="password"
                value={formData.re_password}
                onChange={handleChange}
                placeholder="••••••••"
              />
              {errors.re_password && <Text color="red.500">{errors.re_password}</Text>}
            </FormControl>
            <FormControl isRequired isInvalid={errors.agree}>
              <Checkbox name="agree" isChecked={formData.agree} onChange={handleChange}>
                {t('register.agree', 'I agree to the')}{' '}
                <Link to="/terms" style={{ color: 'blue' }}>
                  {t('register.terms', 'Terms')}
                </Link>{' '}
                &{' '}
                <Link to="/privacy" style={{ color: 'blue' }}>
                  {t('register.privacy', 'Privacy')}
                </Link>
              </Checkbox>
              {errors.agree && <Text color="red.500">{errors.agree}</Text>}
            </FormControl>
            <Button type="submit" colorScheme="blue" width="full">
              {t('register.submit', 'Register')}
            </Button>
            <Box>
              <script
                async
                src="https://telegram.org/js/telegram-widget.js?21"
                data-telegram-login="YourBotName"
                data-size="large"
                data-auth-url="http://localhost:8000/api/auth/telegram/callback/"
                data-request-access="write"
              ></script>
            </Box>
            <Text>
              {t('register.has_account', 'Already have an account?')}{' '}
              <Link to="/login" style={{ color: 'blue' }}>
                {t('header.login', 'Login')}
              </Link>
            </Text>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default Register;