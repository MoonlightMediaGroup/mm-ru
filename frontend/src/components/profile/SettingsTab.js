// src/components/profile/SettingsTab.js
import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Cookies from 'js-cookie';

const SettingsTab = ({ user, setUser }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [formData, setFormData] = useState({
    bio: user.bio || '',
    telegram_username: user.telegram_username || '',
    avatar: null,
    banner: null,
  });
  const cardBg = useColorModeValue('white', 'gray.700'); // Переносим сюда

  const handleChange = e => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = Cookies.get('token');
    const data = new FormData();
    data.append('bio', formData.bio);
    data.append('telegram_username', formData.telegram_username);
    if (formData.avatar) data.append('avatar', formData.avatar);
    if (formData.banner) data.append('banner', formData.banner);

    try {
      const response = await axios.patch(
        'http://localhost:8000/api/auth/users/me/',
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setUser(response.data);
      toast({
        title: t('settings.updated', 'Profile updated'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating profile:', error.response || error.message);
      toast({
        title: t('settings.error', 'Failed to update profile'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4} borderRadius="md" shadow="md" bg={cardBg}>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>{t('settings.bio', 'Bio')}</FormLabel>
            <Textarea name="bio" value={formData.bio} onChange={handleChange} />
          </FormControl>
          <FormControl>
            <FormLabel>{t('settings.telegram', 'Telegram Username')}</FormLabel>
            <Input name="telegram_username" value={formData.telegram_username} onChange={handleChange} />
          </FormControl>
          <FormControl>
            <FormLabel>{t('settings.avatar', 'Avatar')}</FormLabel>
            <Input type="file" name="avatar" accept="image/*" onChange={handleChange} />
          </FormControl>
          <FormControl>
            <FormLabel>{t('settings.banner', 'Banner')}</FormLabel>
            <Input type="file" name="banner" accept="image/*" onChange={handleChange} />
          </FormControl>
          <Button type="submit" colorScheme="blue" width="full">
            {t('settings.submit', 'Save Changes')}
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default SettingsTab;