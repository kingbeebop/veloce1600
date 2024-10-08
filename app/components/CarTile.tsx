// components/CarTile.tsx
"use client";

import React from 'react';
import { Box, Text, Heading } from '@chakra-ui/react';
import { Car } from '../types/car';
import { useRouter } from 'next/navigation';

interface CarTileProps {
  car: Car;
}

const CarTile: React.FC<CarTileProps> = ({ car }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/cars/${car.id}`);
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      shadow="md"
      onClick={handleClick}
      _hover={{ shadow: "lg" }}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      cursor="pointer"
    >
      <Box display="flex" flexGrow={1} alignItems="center">
        <Heading size="md" mr={4}>{car.make} {car.model}</Heading>
      </Box>
      <Text fontWeight="bold">${car.price}</Text>
    </Box>
  );
};

export default CarTile;
