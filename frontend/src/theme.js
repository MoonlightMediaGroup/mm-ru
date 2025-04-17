import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: 'system', // Автоматически определять тему устройства
    useSystemColorMode: true,
  },
  colors: {
    brand: {
      500: '#2B6CB0',
    },
  },
});

export default theme;