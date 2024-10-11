"use client";

import { useRouter } from 'next/navigation';
import { Button, Box, Flex } from '@chakra-ui/react'; // Import Chakra components
import CarDetail from '../../../components/CarDetail';
import { fetchCarById } from '../../../utils/api';
import { Car } from '../../../types/car';

const CarPage = async ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const carId = Number(params.id);
  let car: Car | null = null;

  try {
    car = await fetchCarById(carId);
  } catch (error) {
    console.error("Error fetching car data:", error);
  }

  return (
    <Box padding="4" maxW="1200px" margin="0 auto">
      <Flex justify="flex-start" mb={4}> 
        <Button colorScheme="teal" onClick={() => router.push('/cars')}>
          Back to Cars
        </Button>
      </Flex>

      {car ? (
        <CarDetail car={car} carId={carId} />
      ) : (
        <Box>Car not found</Box>
      )}
    </Box>
  );
};

export default CarPage;
