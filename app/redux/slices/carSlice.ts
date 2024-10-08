import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Car } from '../../types/car';
import { CarApiResponse } from '../../types/apiResponse';
import {
  fetchCars as apiFetchCars,
  fetchCarById as apiFetchCarById,
  searchCarsFromAPI,
  saveCarToApi,
  updateCarFieldAPI
} from '../../utils/api';

interface CarState {
  cars: Car[];
  totalCars: number; // To store total count of cars for pagination
  currentPage: number; // Current page number
  loading: boolean;
  error: string | null;
}

const initialState: CarState = {
  cars: [],
  totalCars: 0,
  currentPage: 1,
  loading: false,
  error: null,
};

// Thunk for fetching cars with pagination
export const fetchCars = createAsyncThunk<CarApiResponse, { page?: number; pageSize?: number }>(
  'cars/fetchCars',
  async ({ page = 1, pageSize = 20 } = {}) => {
    const response = await apiFetchCars(page, pageSize);
    return response; // Return the full response for pagination
  }
);

// Thunk for searching cars
export const searchCars = createAsyncThunk<CarApiResponse, string>(
  'cars/searchCars',
  async (searchTerm) => {
    const response = await searchCarsFromAPI(searchTerm);
    return response; // Return the full response for pagination
  }
);

// Thunk for adding a new car
export const addCar = createAsyncThunk<Car, Omit<Car, 'id'>>(
  'cars/addCar',
  async (newCar) => {
    const response = await saveCarToApi(newCar);
    return response; // Return the newly added car
  }
);

// Thunk for fetching a car by ID
export const fetchCarById = createAsyncThunk<Car, number>(
  'cars/fetchCarById',
  async (id) => {
    const response = await apiFetchCarById(id);
    return response; // Return the data directly
  }
);

// Define a type for the update payload
interface UpdateCarFieldPayload {
  carId: number;
  field: keyof Car; // Field that is being updated
  value: string | number | null; // Value must be one of the types from Car or null
}

// Thunk for updating a specific field of a car
export const updateCarField = createAsyncThunk<UpdateCarFieldPayload, UpdateCarFieldPayload>(
  'cars/updateCarField',
  async ({ carId, field, value }) => {
    await updateCarFieldAPI(carId, field, value); // API call to update specific field
    return { carId, field, value }; // Return the updated field and value
  }
);

const carSlice = createSlice({
  name: 'cars',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCars.fulfilled, (state, action: PayloadAction<CarApiResponse>) => {
        state.loading = false;
        state.cars = action.payload.results; // Update cars with results
        state.totalCars = action.payload.count; // Update total cars for pagination
        state.currentPage = action.payload.current; // Store the current page
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Unknown error';
      })
      .addCase(searchCars.fulfilled, (state, action: PayloadAction<CarApiResponse>) => {
        state.cars = action.payload.results; // Update the state with the search results
        state.totalCars = action.payload.count; // Update total cars from search
      })
      .addCase(addCar.fulfilled, (state, action: PayloadAction<Car>) => {
        state.cars.push(action.payload); // Add the new car to the state
      })
      .addCase(fetchCarById.fulfilled, (state, action: PayloadAction<Car>) => {
        const car = action.payload;
        const existingCar = state.cars.find((c) => c.id === car.id);
        if (!existingCar) {
          state.cars.push(car); // Optionally add the fetched car to the list
        }
      })
      .addCase(updateCarField.fulfilled, (state, action: PayloadAction<UpdateCarFieldPayload>) => {
        const { carId, field, value } = action.payload;
        const car = state.cars.find((c) => c.id === carId);
        if (car) {
          (car[field] as typeof value) = value; // Directly assign the value
        }
      });
  },
});

export default carSlice.reducer;
