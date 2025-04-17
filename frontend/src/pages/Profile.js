// src/pages/Profile.js
import { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Image,
  VStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import Loader from '../components/Loader';
import PostsTab from '../components/profile/PostsTab';
import ShowcaseTab from '../components/profile/ShowcaseTab';
import ReviewsTab from '../components/profile/ReviewsTab';
import SettingsTab from '../components/profile/SettingsTab';

const Profile = () => {
  const { t } = useTranslation();
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const boxBg = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    axios
      .get('http://localhost:8000/api/auth/users/me/', {
        headers: {
          Authorization: `Bearer ${token.trim()}`,
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        setUser(response.data);
        setIsOwnProfile(response.data.username === username);
      })
      .catch(error => {
        console.error('Error fetching profile:', error.response || error.message);
        navigate('/login');
      })
      .finally(() => setIsLoading(false));

    // Загрузка данных пользователя по username (если чужой профиль)
    if (username) {
      axios
        .get(`http://localhost:8000/api/users/${username}/`, {
          headers: { Authorization: `Bearer ${token.trim()}` },
        })
        .then(response => {
          setUser(response.data);
        })
        .catch(error => {
          console.error('Error fetching user:', error.response || error.message);
        });
    }
  }, [username, navigate]);

  if (isLoading || !user) {
    return <Loader />;
  }

  const defaultAvatar = `https://api.dicebear.com/9.x/initials/svg?seed=${user.username || 'Guest'}`;

  return (
    <Box p={6} bg={bgColor} minH="100vh">
      <Box maxW="4xl" mx="auto">
        {user.banner && (
          <Image
            src={user.banner}
            alt="Banner"
            height="200px"
            width="100%"
            objectFit="cover"
            borderRadius="md"
            mb={4}
          />
        )}
        <Flex alignItems="center" mb={6}>
          <Image
            src={user.avatar || defaultAvatar}
            alt="Avatar"
            boxSize="150px"
            borderRadius="full"
            mr={4}
          />
          <VStack align="start">
            <Heading>{user.username}</Heading>
            <Text>{user.email}</Text>
            <Text>
              {t('profile.balance', 'Balance')}: {user.balance || '0.00'} ₽
            </Text>
            <Text>{user.bio || t('profile.noBio', 'No bio yet')}</Text>
          </VStack>
        </Flex>
        <Tabs isFitted variant="enclosed">
          <TabList>
            <Tab>{t('profile.tabs.posts', 'Posts')}</Tab>
            <Tab>{t('profile.tabs.showcase', 'Showcase')}</Tab>
            <Tab>{t('profile.tabs.reviews', 'Reviews')}</Tab>
            {isOwnProfile && <Tab>{t('profile.tabs.settings', 'Settings')}</Tab>}
          </TabList>
          <TabPanels>
            <TabPanel>
              <PostsTab username={username} isOwnProfile={isOwnProfile} />
            </TabPanel>
            <TabPanel>
              <ShowcaseTab username={username} isOwnProfile={isOwnProfile} />
            </TabPanel>
            <TabPanel>
              <ReviewsTab username={username} />
            </TabPanel>
            {isOwnProfile && (
              <TabPanel>
                <SettingsTab user={user} setUser={setUser} />
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};

export default Profile;