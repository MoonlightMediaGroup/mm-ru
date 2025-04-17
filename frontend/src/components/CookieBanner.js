// src/components/CookieBanner.js
import React, { useState } from 'react';
import { Box, Button, Text } from '@chakra-ui/react';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import { useColorModeValue } from '@chakra-ui/system';

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(!Cookies.get('cookies_accepted'));
  const { t } = useTranslation();
  const bg = useColorModeValue('gray.100', 'gray.900');

  const acceptCookies = () => {
    Cookies.set('cookies_accepted', 'true', { expires: 365 });
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <Box bg={bg} p={4} position="fixed" bottom={0} left={0} right={0} zIndex={1000}>
      <Text>{t('cookie_banner.message')}</Text>
      <Button mt={2} onClick={acceptCookies}>
        {t('cookie_banner.accept')}
      </Button>
    </Box>
  );
};

export default CookieBanner;