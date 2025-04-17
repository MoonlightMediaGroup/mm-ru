// src/pages/Home.js
import React from 'react';
import { Box, Text, useColorModeValue } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();
  const bg = useColorModeValue('white', 'gray.800');

  return (
    <Box maxW="container.xl" mx="auto" mt={8} p={6} bg={bg} borderRadius="md" shadow="md">
      <Text fontSize="2xl">{t('home.title', 'Welcome to Moonlight Media')}</Text>
    </Box>
  );
};

export default Home;