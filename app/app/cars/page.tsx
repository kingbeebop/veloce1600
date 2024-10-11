"use client";

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCars } from '../../redux/slices/carSlice'; // Ensure you're importing from the correct slice
import { AppDispatch, RootState } from '../../redux/store';
import { Box, Grid, Spinner, Text, Alert, AlertIcon } from '@chakra-ui/react';
import CarTile from '../../components/CarTile';
import CarFilterBar from '../../components/CarFilterBar';

const CarList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  
  // Map the correct part of the state using the "cars" slice.
  const { cars, allCars, loading, error } = useSelector((state: RootState) => state.cars); 

  useEffect(() => {
    // Dispatch the correct action to fetch cars
    dispatch(fetchCars({}));
  }, [dispatch]);

  useEffect(() => {
    console.log('Updated cars:', cars);
    console.log('All Cars:', allCars);
  }, [cars, allCars]);

  if (loading) {
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
      <CarFilterBar /> {/* Add the CarFilterBar here */}
      <Box display="flex" justifyContent="center" width="100%">
        <Grid
          templateColumns="1fr" // Ensures one tile per row
          gap={6}
          maxWidth="600px" // Adjust as needed for the width of the tiles
          width="100%"      // Ensures it takes the full width of the container
          paddingX={4}     // Optional: adds some horizontal padding
        >
          {cars.map((car) => (
            <CarTile key={car.id} car={car} />
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default CarList;
