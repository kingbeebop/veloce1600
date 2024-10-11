"use client";

import React, { useEffect, useState } from 'react'; // Import useState
import { useDispatch, useSelector } from 'react-redux';
import { fetchCars } from '../../redux/slices/carSlice'; // Ensure you're importing from the correct slice
import { AppDispatch, RootState } from '../../redux/store';
import { Box, Grid, Spinner, Text, Alert, AlertIcon } from '@chakra-ui/react';
import CarTile from '../../components/CarTile';
import CarFilterBar from '../../components/CarFilterBar';

const CarList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { cars, allCars, loading, error } = useSelector((state: RootState) => state.cars); 
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  useEffect(() => {
    dispatch(fetchCars({}));
  }, [dispatch]);

  useEffect(() => {
    console.log('Updated cars:', cars);
    console.log('All Cars:', allCars);
  }, [cars, allCars]);

  // Show loading spinner if loading is true or when navigating to a new page
  if (loading || isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error" mb={4}>
        <AlertIcon />
        <Text>Error: {error}</Text>
      </Alert>
    );
  }

  return (
    <Box>
      <CarFilterBar />
      <Box display="flex" justifyContent="center" width="100%">
        <Grid
          templateColumns="1fr"
          gap={6}
          maxWidth="600px"
          width="100%"
          paddingX={4}
        >
          {cars.map((car) => (
            <CarTile key={car.id} car={car} setLoading={setIsLoading} />
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default CarList;
