import React from 'react';
import { Box, Heading } from '@chakra-ui/react';

const Banner: React.FC = () => {
  return (
    <Box bg="indigo.600" color="black" textAlign="center" py={6}>
      <Heading size="4xl" fontFamily="serif">
        Veloce1600
      </Heading>
    </Box>
  );
};

export default Banner;
