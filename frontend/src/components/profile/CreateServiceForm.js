// src/components/profile/CreateServiceForm.js
import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input, useColorModeValue,
  Textarea, VStack,
  useToast,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Cookies from 'js-cookie';

const CreateServiceForm = ({ setServices }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [formData, setFormData] = useState({ title: '', description: '', price: '' });
  const cardBg = useColorModeValue('white', 'gray.700');

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = Cookies.get('token');
    try {
      const response = await axios.post(
        'http://localhost:8000/api/services/',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setServices(prev => [response.data, ...prev]);
      setFormData({ title: '', description: '', price: '' });
      toast({
        title: t('services.created', 'Service created'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error creating service:', error.response || error.message);
      toast({
        title: t('services.error', 'Failed to create service'),
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
            <FormLabel>{t('services.form.title', 'Title')}</FormLabel>
            <Input name="title" value={formData.title} onChange={handleChange} />
          </FormControl>
          <FormControl>
            <FormLabel>{t('services.form.description', 'Description')}</FormLabel>
            <Textarea name="description" value={formData.description} onChange={handleChange} />
          </FormControl>
          <FormControl>
            <FormLabel>{t('services.form.price', 'Price (₽)')}</FormLabel>
            <Input name="price" type="number" value={formData.price} onChange={handleChange} />
          </FormControl>
          <Button type="submit" colorScheme="blue" width="full">
            {t('services.form.submit', 'Create Service')}
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default CreateServiceForm;