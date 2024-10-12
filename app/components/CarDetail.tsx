"use client";

import React, { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Input,
  FormControl,
  FormLabel,
  Select,
  Typography,
  Avatar,
  useTheme,
  Snackbar,
  MenuItem,
} from '@mui/material';
import { AiOutlineEdit, AiOutlineSave, AiOutlineDelete } from 'react-icons/ai';
import { useDropzone } from 'react-dropzone';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { updateCar, deleteCar } from '../redux/slices/carSlice';
import { Car, CarData } from '../types/car';
import { SelectChangeEvent } from '@mui/material/Select';

type CarCondition = 'New' | 'Used' | 'Classic' | null;

interface CarDetailProps {
  car: Car;
  carId: number;
}

const CarDetail: React.FC<CarDetailProps> = ({ car, carId }) => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const [currentImage, setCurrentImage] = useState<string | null>(car.image || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [carData, setCarData] = useState<CarData>({
    make: car.make,
    model: car.model,
    year: car.year,
    vin: car.vin,
    mileage: car.mileage,
    price: car.price,
    features: car.features,
    condition: car.condition as CarCondition,
  });

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCarData((prev) => ({
      ...prev,
      [name]: ['mileage', 'price', 'year'].includes(name) ? Number(value) || null : value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setCarData((prev) => ({
      ...prev,
      [name]: value === '' ? null : (value as CarCondition),
    }));
  };

  const handleImageChange = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setImageFile(acceptedFiles[0]);
      setCurrentImage(URL.createObjectURL(acceptedFiles[0]));
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleImageChange,
    accept: { 'image/*': [] },
    multiple: false,
  });

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setImageFile(files[0]);
      setCurrentImage(URL.createObjectURL(files[0]));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await dispatch(updateCar({ id: carId, updatedCar: carData, imageFile })).unwrap();
      showSnackbar('Car updated successfully!');
      resetForm();
    } catch (error) {
      showSnackbar('Something went wrong');
      console.error('Update failed', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Permanently delete this car? This cannot be undone.");
    if (!confirmDelete) return;

    try {
      await dispatch(deleteCar(carId)).unwrap();
      showSnackbar('Car has been permanently deleted.');
    } catch (error) {
      showSnackbar('Failed to delete car. Please try again.');
      console.error('Delete failed', error);
    }
  };

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const resetForm = () => {
    setImageFile(null);
    setIsEditMode(false);
    setCurrentImage(car.image || null);
  };

  return (
    <Box
      sx={{
        padding: theme.spacing(4),
        borderRadius: 2,
        boxShadow: theme.shadows[5],
        maxWidth: 1200,
        margin: 'auto',
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      {/* Header Row for Edit and Delete Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Car Details</Typography>
        <Box>
          <IconButton
            onClick={() => setIsEditMode((prev) => !prev)}
            aria-label={isEditMode ? 'Save Car' : 'Edit Car'}
            color="primary"
            disabled={loading}
          >
            {isEditMode ? <AiOutlineSave onClick={handleSubmit} /> : <AiOutlineEdit />}
          </IconButton>
          <IconButton onClick={handleDelete} aria-label="Delete Car" color="error">
            <AiOutlineDelete />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
        {/* Image display and upload section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flex: 1,
            border: `1px dashed ${theme.palette.divider}`,
            borderRadius: 2,
            position: 'relative',
            overflow: 'hidden',
            padding: theme.spacing(2),
          }}
          {...getRootProps()}
        >
          {!isEditMode ? (
            currentImage ? (
              <Avatar
                src={currentImage}
                alt="Current Car"
                variant="rounded"
                sx={{ width: '100%', height: 300, objectFit: 'cover', mb: 2 }}
              />
            ) : (
              <Typography variant="h2" sx={{ fontSize: '100px', margin: 0 }}>
                🚗
              </Typography>
            )
          ) : (
            <>
              <input {...getInputProps()} />
              {currentImage ? (
                <Avatar
                  src={currentImage}
                  alt="Uploaded Car"
                  variant="rounded"
                  sx={{ width: '100%', height: 300, objectFit: 'cover', mb: 2 }}
                />
              ) : (
                <Box
                  sx={{
                    height: 300,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <Typography color="textSecondary">Drop an image here or click to select a file</Typography>
                </Box>
              )}
            </>
          )}

          {isEditMode && (
            <>
              <Typography variant="body2" color="textSecondary" align="center">
                Drag and drop an image or use the button above to upload
              </Typography>
            </>
          )}
        </Box>

        {/* Car details input fields */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {['make', 'model', 'vin', 'mileage', 'price', 'features', 'year', 'condition'].map((field, index) => (
            <FormControl key={index} fullWidth>
              <FormLabel>{capitalizeFirstLetter(field)}</FormLabel>
              {field === 'condition' ? (
                <Select
                  name={field}
                  value={String(carData[field as keyof CarData] || '')}
                  onChange={handleSelectChange}
                  disabled={!isEditMode}
                >
                  <MenuItem value="">Select Condition</MenuItem>
                  <MenuItem value="New">New</MenuItem>
                  <MenuItem value="Used">Used</MenuItem>
                  <MenuItem value="Classic">Classic</MenuItem>
                </Select>
              ) : (
                <Input
                  name={field}
                  value={carData[field as keyof CarData] || ''}
                  onChange={handleInputChange}
                  disabled={!isEditMode}
                  type={['mileage', 'price', 'year'].includes(field) ? 'number' : 'text'}
                />
              )}
            </FormControl>
          ))}
        </Box>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Box>
  );
};

// Helper function to capitalize the first letter of a string
const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default CarDetail;
