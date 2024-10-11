// components/CarTile.tsx
"use client";

import React from 'react';
import { Box, Text, Heading, Avatar } from '@chakra-ui/react';
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

  // Determine the source for the Avatar
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
        {/* Conditional rendering of Avatar */}
        {avatarSrc ? (
          <Avatar
            src={avatarSrc} // Directly use avatarSrc
            size="md" // Size of the Avatar
            mr={4} // Margin to space it from the text
          />
        ) : (
          <Avatar
            name={defaultAvatar} // Set name for default avatar
            bg="gray.300" // Grey background for default
            color="black" // Text color for default
            size="md" // Size of the Avatar
            mr={4} // Margin to space it from the text
          >
            {defaultAvatar} {/* Show car emoji as fallback */}
          </Avatar>
        )}

        <Heading size="md">{car.make} {car.model}</Heading>
      </Box>
      <Text fontWeight="bold">${car.price}</Text>
    </Box>
  );
};

export default CarTile;
