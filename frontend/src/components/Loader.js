import { Box, Spinner, Text, useColorModeValue } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const Loader = () => {
  const { t } = useTranslation();
  const textColor = useColorModeValue('gray.800', 'white');

  return (
    <Box display="flex" minH="100vh" alignItems="center" justifyContent="center">
      <Spinner size="xl" color="blue.500" thickness="4px" />
      <Text ml={4} fontSize="lg" color={textColor}>
      {t('loader.loading', 'Loading...')}
      </Text>
    </Box>
  );
};

export default Loader;