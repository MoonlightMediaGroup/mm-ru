// src/components/profile/ShowcaseTab.js
import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Text,
  Button,
  SimpleGrid,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Cookies from 'js-cookie';
import CreateServiceForm from './CreateServiceForm';

const ShowcaseTab = ({ username, isOwnProfile }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const cardBg = useColorModeValue('white', 'gray.700'); // Переносим сюда

  useEffect(() => {
    const token = Cookies.get('token');
    setIsLoading(true);
    axios
      .get(`http://localhost:8000/api/services/?author=${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => {
        setServices(response.data.results || response.data);
      })
      .catch(error => {
        console.error('Error fetching services:', error.response || error.message);
        toast({
          title: t('services.error', 'Failed to load services'),
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      })
      .finally(() => setIsLoading(false));
  }, [username, toast, t]);

  const handleDelete = async serviceId => {
    const token = Cookies.get('token');
    try {
      await axios.delete(`http://localhost:8000/api/services/${serviceId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(services.filter(service => service.id !== serviceId));
      toast({
        title: t('services.deleted', 'Service deleted'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting service:', error.response || error.message);
      toast({
        title: t('services.error', 'Failed to delete service'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (isLoading) return <Text>{t('loader.loading', 'Loading...')}</Text>;

  return (
    <VStack spacing={4} align="stretch">
      {isOwnProfile && <CreateServiceForm setServices={setServices} />}
      {services.length === 0 ? (
        <Text>{t('services.empty', 'No services yet')}</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {services.map(service => (
            <Box key={service.id} p={4} borderRadius="md" shadow="md" bg={cardBg}>
              <Text fontWeight="bold">{service.title}</Text>
              <Text>{service.description}</Text>
              <Text>{t('services.price', 'Price')}: {service.price} ₽</Text>
              {isOwnProfile && (
                <Button
                  colorScheme="red"
                  size="sm"
                  mt={2}
                  onClick={() => handleDelete(service.id)}
                >
                  {t('services.delete', 'Delete')}
                </Button>
              )}
            </Box>
          ))}
        </SimpleGrid>
      )}
    </VStack>
  );
};

export default ShowcaseTab;