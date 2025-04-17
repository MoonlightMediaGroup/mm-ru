// src/components/profile/ReviewsTab.js
import { useState, useEffect } from 'react';
import { Box, VStack, Text, useToast, useColorModeValue } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Cookies from 'js-cookie';

const ReviewsTab = ({ username }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const cardBg = useColorModeValue('white', 'gray.700'); // Переносим сюда

  useEffect(() => {
    const token = Cookies.get('token');
    setIsLoading(true);
    axios
      .get(`http://localhost:8000/api/reviews/?target=${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => {
        setReviews(response.data.results || response.data);
      })
      .catch(error => {
        console.error('Error fetching reviews:', error.response || error.message);
        toast({
          title: t('reviews.error', 'Failed to load reviews'),
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      })
      .finally(() => setIsLoading(false));
  }, [username, toast, t]);

  if (isLoading) return <Text>{t('loader.loading', 'Loading...')}</Text>;

  return (
    <VStack spacing={4} align="stretch">
      {reviews.length === 0 ? (
        <Text>{t('reviews.empty', 'No reviews yet')}</Text>
      ) : (
        reviews.map(review => (
          <Box key={review.id} p={4} borderRadius="md" shadow="md" bg={cardBg}>
            <Text fontWeight="bold">{review.author.username}</Text>
            <Text>Rating: {review.rating}/5</Text>
            <Text>{review.text}</Text>
          </Box>
        ))
      )}
    </VStack>
  );
};

export default ReviewsTab;