"use client";

import React, { useState } from 'react';
import {
  Box,
  Input,
  Button,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input as ChakraInput,
  Select,
} from '@chakra-ui/react';
import { SearchIcon, AddIcon } from '@chakra-ui/icons';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { searchCars, addCar } from '../redux/slices/carSlice';
import { Car } from '../types/car'; // Adjust the import path as necessary

const CarFilterBar: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchTerm, setSearchTerm] = useState('');
  const [newCar, setNewCar] = useState<Car>({
    id: 0, // Placeholder; id will be set on the server
    make: null,
    model: null,
    year: null,
    vin: null,
    mileage: null,
    price: null,
    features: null,
    condition: null,
    image: null,
    owner: null,
    created_at: null,
    updated_at: null,
  });

  const handleSearch = () => {
    dispatch(searchCars(searchTerm));
  };

  const handleAddCar = () => {
    // Dispatch the action to add the car
    dispatch(addCar(newCar));
    onClose(); // Close the modal
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center" p={4} bg="gray.100" width="100%">
      <Box display="flex" alignItems="center" width="33%" maxWidth="600px" justifyContent="center">
        <Input 
          placeholder="Search cars..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          width="150px" // Adjusted width for smaller input
          mr={2}
        />
        <IconButton 
          aria-label="Search Cars" 
          icon={<SearchIcon />} 
          onClick={handleSearch}
          size="sm" // Smaller button size
        />
        <IconButton 
          aria-label="Add Car" 
          icon={<AddIcon />} 
          onClick={onOpen} 
          ml={2} // Spacing between buttons
          size="sm" // Smaller button size
        />
      </Box>
      
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Car</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>Make</FormLabel>
              <ChakraInput 
                value={newCar.make || ''}
                onChange={(e) => setNewCar({ ...newCar, make: e.target.value })}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Model</FormLabel>
              <ChakraInput 
                value={newCar.model || ''}
                onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Year</FormLabel>
              <ChakraInput 
                type="number" 
                value={newCar.year || ''}
                onChange={(e) => setNewCar({ ...newCar, year: Number(e.target.value) || null })}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>VIN</FormLabel>
              <ChakraInput 
                value={newCar.vin || ''}
                onChange={(e) => setNewCar({ ...newCar, vin: e.target.value })}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Mileage</FormLabel>
              <ChakraInput 
                type="number" 
                value={newCar.mileage || ''}
                onChange={(e) => setNewCar({ ...newCar, mileage: Number(e.target.value) || null })}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Price</FormLabel>
              <ChakraInput 
                type="number" 
                value={newCar.price || ''}
                onChange={(e) => setNewCar({ ...newCar, price: Number(e.target.value) || null })}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Features</FormLabel>
              <ChakraInput 
                value={newCar.features || ''}
                onChange={(e) => setNewCar({ ...newCar, features: e.target.value })}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Condition</FormLabel>
              <Select 
                value={newCar.condition || ''} 
                onChange={(e) => setNewCar({ ...newCar, condition: e.target.value as 'new' | 'used' | 'classic' })}
              >
                <option value="" disabled>Select condition</option>
                <option value="new">New</option>
                <option value="used">Used</option>
                <option value="classic">Classic</option>
              </Select>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Image</FormLabel>
              <ChakraInput 
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null; // Use optional chaining
                  setNewCar({ ...newCar, image: file ? file.name : null }); // Store the file name or null
                }}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddCar}>
              Submit
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CarFilterBar;