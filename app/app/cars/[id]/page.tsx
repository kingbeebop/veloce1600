"use client";

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCarById, updateCarField } from '../../../redux/slices/carSlice';
import { AppDispatch } from '../../../redux/store';
import { RootState } from '../../../types/redux/types';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Heading,
  Text,
  Stack,
  Spinner,
  Alert,
  AlertIcon,
  Button,
  Image,
  Badge,
  Input,
} from '@chakra-ui/react';

const CarDetail: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const carId = parseInt(id, 10);

  const { cars, loading, error } = useSelector((state: RootState) => state.cars);
  const car = cars.find(c => c.id === carId);

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    vin: '',
    mileage: '',
    price: '',
    features: '',
    condition: '',
  });

  // Define the keys of formData
  type FormDataKeys = keyof typeof formData;

  useEffect(() => {
    if (!car && !isNaN(carId)) {
      dispatch(fetchCarById(carId));
    }
  }, [car, carId, dispatch]);

  useEffect(() => {
    if (car) {
      setFormData({
        make: car.make || '',
        model: car.model || '',
        year: car.year?.toString() || '',
        vin: car.vin || '',
        mileage: car.mileage?.toString() || '',
        price: car.price?.toString() || '',
        features: car.features || '',
        condition: car.condition || '',
      });
    }
  }, [car]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = () => {
    for (const field in formData) {
      // Cast field to FormDataKeys
      dispatch(updateCarField({ carId: carId, field: field as FormDataKeys, value: formData[field as FormDataKeys] }));
    }
    setEditMode(false); // Exit edit mode after saving
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Spinner size="xl" />
    </Box>
  );

  if (error) return (
    <Alert status="error">
      <AlertIcon />
      Error: {error}
    </Alert>
  );

  if (!car) return (
    <Alert status="warning">
      <AlertIcon />
      Car not found.
    </Alert>
  );

  return (
    <Box maxW="lg" mx="auto" p={6} borderWidth="1px" borderRadius="lg" boxShadow="lg">
      <Stack spacing={4}>
        <Heading as="h2" size="lg">
          {editMode ? (
            <>
              <Input name="make" value={formData.make} onChange={handleChange} placeholder="Make" />
              <Input name="model" value={formData.model} onChange={handleChange} placeholder="Model" />
              <Input name="year" value={formData.year} onChange={handleChange} placeholder="Year" type="number" />
            </>
          ) : (
            `${car.make} ${car.model} (${car.year})`
          )}
        </Heading>
        
        {editMode ? (
          <>
            <Input name="vin" value={formData.vin} onChange={handleChange} placeholder="VIN" />
            <Input name="mileage" value={formData.mileage} onChange={handleChange} placeholder="Mileage" type="number" />
            <Input name="price" value={formData.price} onChange={handleChange} placeholder="Price" type="number" />
            <Input name="features" value={formData.features} onChange={handleChange} placeholder="Features" />
            <Input name="condition" value={formData.condition} onChange={handleChange} placeholder="Condition" />
          </>
        ) : (
          <>
            <Text><strong>VIN:</strong> {car.vin}</Text>
            <Text><strong>Mileage:</strong> {car.mileage?.toLocaleString()} miles</Text>
            <Text><strong>Price:</strong> ${car.price?.toLocaleString()}</Text>
            <Badge colorScheme={car.condition === 'new' ? 'green' : 'orange'}>
              {car.condition}
            </Badge>
            <Text><strong>Features:</strong> {car.features || 'No additional features listed.'}</Text>
            {car.image && (
              <Image
                src={car.image}
                alt={`${car.make} ${car.model}`}
                borderRadius="md"
                objectFit="cover"
                width="100%"
                maxH="400px"
              />
            )}
            <Text><strong>Owner ID:</strong> {car.owner}</Text>
          </>
        )}

        <Button colorScheme="blue" onClick={editMode ? handleSave : () => setEditMode(true)}>
          {editMode ? 'Save' : 'Edit'}
        </Button>
        <Button colorScheme="gray" onClick={() => router.back()}>
          Back
        </Button>
      </Stack>
    </Box>
  );
};

export default CarDetail;
