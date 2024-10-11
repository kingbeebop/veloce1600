import React, { useState } from 'react';
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Image,
  useToast,
  IconButton,
} from '@chakra-ui/react';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai'; // Import icons
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
    <Flex
      direction="column"
      align="center"
      justify="center"
      py={8}
      w="100%"
      maxW="1200px"
      mx="auto"
    >
      <Box
        as="form"
        onSubmit={handleSubmit}
        bg="white"
        p={8}
        borderRadius="md"
        boxShadow="lg"
        display="flex"
        flexDirection="column"
        height="90vh" // Constrain height to 90% of the viewport
        overflowY="hidden" // Prevent overflow
      >
        {/* Edit and Delete Icon Buttons */}
        <Flex justify="flex-end">
          <IconButton
            icon={<AiOutlineEdit />}
            colorScheme="blue"
            onClick={handleSubmit}
            aria-label="Edit Car"
            isLoading={loading}
            mr={2}
          />
          <IconButton
            icon={<AiOutlineDelete />}
            colorScheme="red"
            onClick={handleDelete}
            aria-label="Delete Car"
          />
        </Flex>

        {/* Car Image */}
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          maxWidth="300px"
          width="100%"
          height="300px" // Fixed height for the square aspect ratio
          overflow="hidden" // Hide overflow
          mx="auto" // Center the image horizontally
          mb={4} // Margin bottom for spacing
        >
          {currentImage && ( // Conditional rendering for the image
            <Image
              src={currentImage}
              alt="Current Car"
              boxSize="100%"
              objectFit="cover" // Cover the area
              borderRadius="md"
            />
          )}
        </Box>

        {/* Car Details Inputs */}
        <Flex
          direction="column"
          gap={4}
          flexGrow={1} // Allow this section to grow
        >
          <Flex justify="space-between" flexWrap="wrap">
            <FormControl id="make" isRequired width="30%">
              <FormLabel>Make</FormLabel>
              <Input
                type="text"
                name="make"
                value={carData.make || ''}
                onChange={handleChange}
                placeholder="Make"
              />
            </FormControl>

            <FormControl id="model" isRequired width="30%">
              <FormLabel>Model</FormLabel>
              <Input
                type="text"
                name="model"
                value={carData.model || ''}
                onChange={handleChange}
                placeholder="Model"
              />
            </FormControl>

            <FormControl id="year" isRequired width="30%">
              <FormLabel>Year</FormLabel>
              <Input
                type="number"
                name="year"
                value={carData.year || ''}
                onChange={handleChange}
                placeholder="Year"
              />
            </FormControl>
          </Flex>

          <Flex justify="space-between" flexWrap="wrap">
            <FormControl id="vin" width="30%">
              <FormLabel>VIN</FormLabel>
              <Input
                type="text"
                name="vin"
                value={carData.vin || ''}
                onChange={handleChange}
                placeholder="VIN"
              />
            </FormControl>

            <FormControl id="mileage" width="30%">
              <FormLabel>Mileage</FormLabel>
              <Input
                type="number"
                name="mileage"
                value={carData.mileage || ''}
                onChange={handleChange}
                placeholder="Mileage"
              />
            </FormControl>

            <FormControl id="price" width="30%">
              <FormLabel>Price</FormLabel>
              <Input
                type="number"
                name="price"
                value={carData.price || ''}
                onChange={handleChange}
                placeholder="Price"
              />
            </FormControl>
          </Flex>

          <Flex justify="space-between" flexWrap="wrap">
            <FormControl id="features" width="30%">
              <FormLabel>Features</FormLabel>
              <Input
                type="text"
                name="features"
                value={carData.features || ''}
                onChange={handleChange}
                placeholder="Features"
              />
            </FormControl>

            <FormControl id="condition" isRequired width="30%">
              <FormLabel>Condition</FormLabel>
              <Select name="condition" value={carData.condition || ''} onChange={handleChange}>
                <option value="">Select Condition</option>
                <option value="new">New</option>
                <option value="used">Used</option>
                <option value="classic">Classic</option>
              </Select>
            </FormControl>
          </Flex>

          {/* Image Upload */}
          <FormControl id="image">
            <FormLabel>Upload New Image</FormLabel>
            <Input type="file" accept="image/*" onChange={handleImageChange} />
          </FormControl>
        </Flex>
      </Box>
    </Flex>
  );
};

export default CarDetail;
