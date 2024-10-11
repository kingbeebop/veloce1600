import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Car } from '../../types/car';
import { CarApiResponse } from '../../types/apiResponse';
import { fetchCars as apiFetchCars, searchCarsFromAPI, submitCar } from '../../utils/api';
import { RootState } from '../store';

interface PriceFilter {
    operator: 'greater' | 'less';
    value: number;
}

interface FilterState {
    searchTerm: string;
    priceFilter: PriceFilter | null;
    conditionFilter: 'New' | 'Used' | 'Classic' | null;
}

interface CarState {
    cars: Car[];          // Current filtered cars based on user actions
    allCars: Car[];      // Store all cars for filtering
    count: number;        // To store total count of cars for pagination
    currentPage: number;  // Current page number
    loading: boolean;     // Loading state
    error: string | null; // Error message
    pageSize: number;     // Size of each page
    page: number;         // Current page for pagination
}

const initialState: CarState = {
    cars: [],
    allCars: [],
    count: 0,
    currentPage: 1,
    loading: false,
    error: null,
    pageSize: 10,
    page: 1
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
export const searchCars = createAsyncThunk<CarApiResponse, { searchTerm: string; page?: number; pageSize?: number }>(
    'cars/searchCars',
    async ({ searchTerm, page = 1, pageSize = 20 }) => {
        const response = await searchCarsFromAPI(searchTerm);
        return response; // Return the full response for pagination
    }
);

// Thunk for adding a new car with optional image upload
export const addCar = createAsyncThunk<Car, { newCar: Omit<Car, 'id'>; imageFile?: File | null }>(
    'cars/addCar',
    async ({ newCar, imageFile }, { rejectWithValue }) => {
        try {
            const response = await submitCar(newCar, imageFile ?? null); // Pass null explicitly if imageFile is undefined
            return response; // Return the newly added car
        } catch (error) {
            return rejectWithValue("Failed to add car"); // Handle error and return rejected value
        }
    }
);

const carSlice = createSlice({
    name: 'cars',
    initialState,
    reducers: {
        filterCars(state, action: PayloadAction<{ filters: FilterState }>) {
            const { searchTerm, priceFilter, conditionFilter } = action.payload.filters;

            // Check if all filter fields are null, empty, or undefined
            const areAllFiltersEmpty = !searchTerm && !priceFilter && !conditionFilter;

            // If all filters are empty, return allCars
            if (areAllFiltersEmpty) {
                state.cars = state.allCars; // Reset cars to allCars
                state.count = state.allCars.length; // Update count based on allCars
                return;
            }

            // Start with all cars
            let filteredCars = [...state.allCars];

            // Apply search term filtering
            if (searchTerm) {
                const searchStr = searchTerm.toLowerCase();
                filteredCars = filteredCars.filter(car => {
                    return (
                        car.make?.toLowerCase().includes(searchStr) ||
                        car.model?.toLowerCase().includes(searchStr) ||
                        car.year?.toString().includes(searchStr)
                    );
                });
            }

            // Apply price filter if it exists
            if (priceFilter) {
                filteredCars = filteredCars.filter(car => {
                    if (priceFilter.operator === 'greater') {
                        return car.price != null && car.price > priceFilter.value;
                    } else if (priceFilter.operator === 'less') {
                        return car.price != null && car.price < priceFilter.value;
                    }
                    return true;
                });
            }

            // Apply condition filter if it exists
            if (conditionFilter) {
                filteredCars = filteredCars.filter(car =>
                    (car.condition && car.condition.toLowerCase() === conditionFilter.toLowerCase()) || car.condition == null
                );
            }

            state.cars = filteredCars; // Update filtered cars
            state.count = filteredCars.length; // Update count based on current filtered cars
        },
        setAllCars(state, action: PayloadAction<Car[]>) {
            state.allCars = action.payload; // Store fetched cars in allCars
            state.cars = action.payload; // Initialize cars with all cars
            state.count = action.payload.length; // Update count
        },
        setCurrentPage(state, action: PayloadAction<number>) {
            state.currentPage = action.payload; // Update current page
        },
        resetCars(state) {
            // Reset cars to the first page of allCars
            state.cars = state.allCars.slice(0, state.pageSize); // Adjust this if needed
            state.currentPage = 1; // Reset to the first page
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCars.pending, (state) => {
                state.loading = true; // Set loading state to true when fetching
                state.error = null; // Reset error state
            })
            .addCase(fetchCars.fulfilled, (state, action: PayloadAction<CarApiResponse>) => {
                state.loading = false; // Set loading state to false when fetching is done
                state.allCars = action.payload.results; // Assuming the response has a `cars` field
                state.cars = action.payload.results; // Initialize cars with fetched cars
                state.count = action.payload.count; // Assuming the response has a `total` field
            })
            .addCase(fetchCars.rejected, (state, action) => {
                state.loading = false; // Set loading state to false on error
                state.error = action.error.message || "Failed to fetch cars"; // Set error message
            });
    },
});

// Export actions and selectors
export const { filterCars, setAllCars, setCurrentPage, resetCars } = carSlice.actions;
export const selectCars = (state: RootState) => state.cars.cars;
export const selectAllCars = (state: RootState) => state.cars.allCars;
export const selectCount = (state: RootState) => state.cars.count; // Updated selector
export const selectCurrentPage = (state: RootState) => state.cars.currentPage;
export const selectLoading = (state: RootState) => state.cars.loading; // Select loading state
export const selectError = (state: RootState) => state.cars.error; // Select error state

export default carSlice.reducer;
