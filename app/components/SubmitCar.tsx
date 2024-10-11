import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Spinner,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { CarData } from "../types/car"; // Import CarData type
import { submitCar } from "../utils/api"; // The API utility to submit a car

interface SubmitCarProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void; // Trigger fetchCars after submission
}

const SubmitCar: React.FC<SubmitCarProps> = ({ isOpen, onClose, onSubmit }) => {
  const [newCar, setNewCar] = useState<CarData>({
    make: null,
    model: null,
    year: null,
    vin: null,
    mileage: null,
    price: null,
    features: null,
    condition: null,
  });
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await submitCar(newCar, image); // Submit the car and image
      toast({
        title: "Car submitted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onSubmit(); // Trigger fetching cars
      onClose(); // Close the modal
    } catch (error) {
      toast({
        title: "Failed to submit car",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Car</ModalHeader>
        <ModalBody>
          <FormControl>
            <FormLabel>Make</FormLabel>
            <Input
              value={newCar.make || ""}
              onChange={(e) => setNewCar({ ...newCar, make: e.target.value })}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Model</FormLabel>
            <Input
              value={newCar.model || ""}
              onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Year</FormLabel>
            <Input
              type="number"
              value={newCar.year || ""}
              onChange={(e) => setNewCar({ ...newCar, year: Number(e.target.value) || null })}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>VIN</FormLabel>
            <Input
              value={newCar.vin || ""}
              onChange={(e) => setNewCar({ ...newCar, vin: e.target.value })}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Mileage</FormLabel>
            <Input
              type="number"
              value={newCar.mileage || ""}
              onChange={(e) => setNewCar({ ...newCar, mileage: Number(e.target.value) || null })}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Price</FormLabel>
            <Input
              type="number"
              value={newCar.price || ""}
              onChange={(e) => setNewCar({ ...newCar, price: Number(e.target.value) || null })}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Features</FormLabel>
            <Textarea
              value={newCar.features || ""}
              onChange={(e) => setNewCar({ ...newCar, features: e.target.value })}
              placeholder="Enter features, separated by commas"
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Condition</FormLabel>
            <Select
              value={newCar.condition || ""}
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
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setImage(file);
              }}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit} isDisabled={loading}>
            {loading ? <Spinner size="sm" /> : "Submit"}
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SubmitCar;