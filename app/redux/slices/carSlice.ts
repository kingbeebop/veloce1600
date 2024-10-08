import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Car } from '../../types/car';
import { AppDispatch, RootState } from '../store';

interface CarState {
  cars: Car[];
  loading: boolean;
  error: string | null;
}

const initialState: CarState = {
  cars: [],
  loading: false,
  error: null,
};

// Thunk for fetching cars
export const fetchCars = createAsyncThunk<Car[], void>(
  'cars/fetchCars',
  async () => {
    const response = await fetch('/api/cars'); // Update with your API endpoint
    if (!response.ok) {
      throw new Error('Failed to fetch cars');
    }
    return (await response.json()) as Car[];
  }
);

// Thunk for fetching a car by ID
export const fetchCarById = createAsyncThunk<Car, number>(
  'cars/fetchCarById',
  async (id) => {
    const response = await fetch(`/api/cars/${id}`); // Update with your API endpoint
    if (!response.ok) {
      throw new Error('Failed to fetch car');
    }
    return (await response.json()) as Car;
  }
);

const carSlice = createSlice({
  name: 'cars',
  initialState,
  reducers: {
    // Add any additional synchronous reducers if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCars.fulfilled, (state, action: PayloadAction<Car[]>) => {
        state.loading = false;
        state.cars = action.payload;
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Unknown error';
      })
      .addCase(fetchCarById.fulfilled, (state, action: PayloadAction<Car>) => {
        const car = action.payload;
        const existingCar = state.cars.find(c => c.id === car.id);
        if (!existingCar) {
          state.cars.push(car); // Optionally add the fetched car to the list
        }
      });
  },
});

export default carSlice.reducer;
