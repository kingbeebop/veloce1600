// components/CarTile.tsx
"use client";

import React from 'react';
import { Box, Text, Heading, Avatar } from '@chakra-ui/react';
import { Car } from '../types/car';
import { useRouter } from 'next/navigation';

interface CarTileProps {
  car: Car;
  setLoading: (loading: boolean) => void; // Pass setLoading function as a prop
}

const CarTile: React.FC<CarTileProps> = ({ car, setLoading }) => {
  const router = useRouter();

  const handleClick = () => {
    setLoading(true); // Set loading to true when clicked
    router.push(`/cars/${car.id}`);
  };

  const avatarSrc = car.image ? car.image : null; // Use car.image if it's not null
  const defaultAvatar = "🚗"; // Car emoji for default avatar

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
        {avatarSrc ? (
          <Avatar
            src={avatarSrc}
            size="md"
            mr={4}
          />
        ) : (
          <Avatar
            name={defaultAvatar}
            bg="gray.300"
            color="black"
            size="md"
            mr={4}
          >
            {defaultAvatar}
          </Avatar>
        )}
        <Heading size="md">{car.make} {car.model}</Heading>
      </Box>
      <Text fontWeight="bold">${car.price}</Text>
    </Box>
  );
};

export default CarTile;
