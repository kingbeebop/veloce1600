import React, { useState } from 'react';
import { Box, Button, Flex, FormControl, FormLabel, Input, Select, Image, Spinner, useToast, Text } from '@chakra-ui/react';
import { updateCar, deleteCar } from '../utils/api';
import { Car, CarData } from '../types/car';

interface CarDetailProps {
  car: Car; // Expecting a car object of type Car passed as a prop
  carId: number; // To use in update
}

const CarDetail: React.FC<CarDetailProps> = ({ car, carId }) => {
  const toast = useToast();
  const [currentImage, setCurrentImage] = useState<string | null>(car.image || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [carData, setCarData] = useState<CarData>({
    make: car.make,
    model: car.model,
    year: car.year,
    vin: car.vin,
    mileage: car.mileage,
    price: car.price,
    features: car.features,
    condition: car.condition,
  });

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCarData((prev) => ({
      ...prev,
      [name]: value === '' ? null : value,
    }));
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateCar(carId, carData, imageFile);
      toast({
        title: "Success",
        description: "Car updated successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setCurrentImage(imageFile ? URL.createObjectURL(imageFile) : currentImage);
      setImageFile(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update car. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error("Update failed", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle car deletion with confirmation toast
  const handleDelete = async () => {
    const confirmDelete = confirm("Permanently delete this car? This cannot be undone.");
    if (!confirmDelete) return;

    try {
      await deleteCar(carId);
      toast({
        title: "Car Deleted",
        description: "Car has been permanently deleted.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete car. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error("Delete failed", error);
    }
  };

  return (
    <Flex direction="column" align="center" justify="center" py={8}>
      {/* Car Image */}
      {currentImage && (
        <Image
          src={currentImage}
          alt="Current Car"
          boxSize="300px"
          objectFit="cover"
          mb={8}
          borderRadius="md"
        />
      )}

      {/* Car Form */}
      <Box
        as="form"
        onSubmit={handleSubmit}
        bg="white"
        p={8}
        borderRadius="md"
        boxShadow="lg"
        w={["100%", "70%", "40%"]}
      >
        <Text fontSize="2xl" mb={4} fontWeight="bold" textAlign="center">
          Car Details
        </Text>

        {/* Success/Error Messages will be shown as Chakra toasts */}

        {/* Make */}
        <FormControl id="make" mb={4} isRequired>
          <FormLabel>Make</FormLabel>
          <Input
            type="text"
            name="make"
            value={carData.make || ''}
            onChange={handleChange}
            placeholder="Make"
          />
        </FormControl>

        {/* Model */}
        <FormControl id="model" mb={4} isRequired>
          <FormLabel>Model</FormLabel>
          <Input
            type="text"
            name="model"
            value={carData.model || ''}
            onChange={handleChange}
            placeholder="Model"
          />
        </FormControl>

        {/* Year */}
        <FormControl id="year" mb={4} isRequired>
          <FormLabel>Year</FormLabel>
          <Input
            type="number"
            name="year"
            value={carData.year || ''}
            onChange={handleChange}
            placeholder="Year"
          />
        </FormControl>

        {/* VIN */}
        <FormControl id="vin" mb={4}>
          <FormLabel>VIN</FormLabel>
          <Input
            type="text"
            name="vin"
            value={carData.vin || ''}
            onChange={handleChange}
            placeholder="VIN"
          />
        </FormControl>

        {/* Mileage */}
        <FormControl id="mileage" mb={4}>
          <FormLabel>Mileage</FormLabel>
          <Input
            type="number"
            name="mileage"
            value={carData.mileage || ''}
            onChange={handleChange}
            placeholder="Mileage"
          />
        </FormControl>

        {/* Price */}
        <FormControl id="price" mb={4}>
          <FormLabel>Price</FormLabel>
          <Input
            type="number"
            name="price"
            value={carData.price || ''}
            onChange={handleChange}
            placeholder="Price"
          />
        </FormControl>

        {/* Features */}
        <FormControl id="features" mb={4}>
          <FormLabel>Features</FormLabel>
          <Input
            type="text"
            name="features"
            value={carData.features || ''}
            onChange={handleChange}
            placeholder="Features"
          />
        </FormControl>

        {/* Condition */}
        <FormControl id="condition" mb={4} isRequired>
          <FormLabel>Condition</FormLabel>
          <Select name="condition" value={carData.condition || ''} onChange={handleChange}>
            <option value="">Select Condition</option>
            <option value="new">New</option>
            <option value="used">Used</option>
            <option value="classic">Classic</option>
          </Select>
        </FormControl>

        {/* Image Upload */}
        <FormControl id="image" mb={6}>
          <FormLabel>Upload New Image</FormLabel>
          <Input type="file" accept="image/*" onChange={handleImageChange} />
        </FormControl>

        {/* Submit Button */}
        <Button
          type="submit"
          colorScheme="blue"
          isLoading={loading}
          w="100%"
          mb={4}
        >
          {loading ? <Spinner /> : "Update Car"}
        </Button>

        {/* Delete Car Button */}
        <Button
          onClick={handleDelete}
          colorScheme="red"
          variant="outline"
          w="100%"
        >
          Delete Car
        </Button>
      </Box>
    </Flex>
  );
};

export default CarDetail;
