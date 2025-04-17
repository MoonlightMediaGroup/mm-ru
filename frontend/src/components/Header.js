// src/components/Header.js
import { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

const Header = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode(); // Для смены темы
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = Cookies.get('token');
    console.log('Token retrieved:', token);
    if (token) {
      const headers = {
        Authorization: `Bearer ${token.trim()}`,
        'Content-Type': 'application/json',
      };
      console.log('Request headers:', headers);
      axios
        .get('http://localhost:8000/api/auth/users/me/', {
          headers,
        })
        .then(response => {
          console.log('User data received:', response.data);
          setUser(response.data);
        })
        .catch(error => {
          console.error('Error fetching user:', error.response || error.message);
          console.log('Error status:', error.response?.status);
          console.log('Error data:', error.response?.data);
          if (error.response?.status === 401 || error.response?.status === 403) {
            console.log('Invalid token, removing cookie');
            Cookies.remove('token');
            setUser(null);
            navigate('/login');
          }
        });
    } else {
      console.log('No token found in cookies');
      setUser(null);
    }
  }, [navigate]);

  const handleLogout = () => {
    console.log('Logging out, removing token');
    Cookies.remove('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <Box bg={bgColor} px={4} shadow="md">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Box>
          <Link to="/">{t('header.logo', 'Moonlight Media')}</Link>
        </Box>
        <Flex alignItems="center">
          <IconButton
            size="md"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Toggle Menu"
            display={{ md: 'none' }}
            onClick={() => setIsOpen(!isOpen)}
          />
          <Flex
            display={{ base: isOpen ? 'flex' : 'none', md: 'flex' }}
            alignItems="center"
            ml={10}
          >
            <Button as={Link} to="/" variant="ghost" mr={2}>
              {t('header.home', 'Home')}
            </Button>
            {user ? (
              <>
                <Text mr={4} color={textColor}>
                  {t('header.welcome', 'Welcome')}, {user.username} (
                  {user.balance || '0.00'} {t('header.currency', '₽')})
                </Text>
                <Button
                  as={Link}
                  to={`/profile/${user.username}`}
                  variant="ghost"
                  mr={2}
                >
                  {t('header.profile', 'Profile')}
                </Button>
                <Button onClick={handleLogout} variant="ghost">
                  {t('header.logout', 'Logout')}
                </Button>
              </>
            ) : (
              <>
                <Button as={Link} to="/login" variant="ghost" mr={2}>
                  {t('header.login', 'Login')}
                </Button>
                <Button as={Link} to="/register" variant="ghost">
                  {t('header.register', 'Register')}
                </Button>
              </>
            )}
            <IconButton
              aria-label="Toggle theme"
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              variant="ghost"
              ml={2}
            />
            <Menu>
              <MenuButton as={Button} variant="ghost" ml={2}>
                {i18n.language === 'ru' ? 'RU' : 'EN'}
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => i18n.changeLanguage('en')}>
                  English
                </MenuItem>
                <MenuItem onClick={() => i18n.changeLanguage('ru')}>
                  Русский
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
        </Flex>
      </Box>
    );
};

export default Header;