// src/components/Footer.js
import { Box, Flex, Text, Link, useColorModeValue } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  const { t } = useTranslation();
  const bgColor = useColorModeValue('gray.100', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Box bg={bgColor} py={6} mt="auto">
      <Flex
        maxW="4xl"
        mx="auto"
        px={4}
        direction={{ base: 'column', md: 'row' }}
        align="center"
        justify="space-between"
      >
        <Text color={textColor} mb={{ base: 4, md: 0 }}>
          © {new Date().getFullYear()} {t('footer.copyright', 'Moonlight Media. All rights reserved.')}
        </Text>
        <Flex gap={4}>
          <Link as={RouterLink} to="/terms" color={textColor} _hover={{ color: 'blue.500' }}>
            {t('footer.terms', 'Terms')}
          </Link>
          <Link as={RouterLink} to="/privacy" color={textColor} _hover={{ color: 'blue.500' }}>
            {t('footer.privacy', 'Privacy')}
          </Link>
          <Link href="mailto:support@moonlightmedia.com" color={textColor} _hover={{ color: 'blue.500' }}>
            {t('footer.contact', 'Contact')}
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Footer;