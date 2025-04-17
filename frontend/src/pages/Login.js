// src/pages/Login.js
import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
  Checkbox,
  useColorModeValue,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const boxBg = useColorModeValue('white', 'gray.800');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8000/api/auth/jwt/create/',
        { email, username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log('Login response:', response.data);
      // Устанавливаем токен с опцией expires в зависимости от rememberMe
      const cookieOptions = rememberMe ? { expires: 7 } : {}; // 7 дней или сессия
      Cookies.set('token', response.data.access, cookieOptions);
      console.log('Token set:', response.data.access);
      toast({
        title: t('login.success', 'Login successful'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/');
    } catch (error) {
      console.error('Login error:', error.response || error.message);
      toast({
        title: t('login.error', 'Login failed'),
        description: error.response?.data?.detail || 'Please check your credentials',
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
          {t('login.title', 'Login')}
        </Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>{t('login.email', 'Email')}</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="mercynash@inbox.ru"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>{t('login.username', 'Username')}</FormLabel>
              <Input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Veronika3"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>{t('login.password', 'Password')}</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </FormControl>
            <FormControl>
              <Checkbox
                isChecked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
              >
                {t('login.rememberMe', 'Remember me')}
              </Checkbox>
            </FormControl>
            <Button type="submit" colorScheme="blue" width="full">
              {t('login.submit', 'Login')}
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default Login;