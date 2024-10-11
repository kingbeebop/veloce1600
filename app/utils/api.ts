// api.ts
import axios from 'axios';
import store from '../redux/store'; // Assuming this is your Redux store
import { RootState } from '../redux/store';
import { refreshToken, loginUser, logout, selectAuth } from '../redux/slices/authSlice'; // Auth slice actions
import { Car, CarData } from '../types/car';
import { CarApiResponse } from '../types/apiResponse';
import { Owner } from '../types/owner';
import { Sale } from '../types/sale';

// Base axios instance for unprotected requests
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Adjust as needed
});

// Protected API request wrapper
const protectedApi = async (request: Function, ...args: any[]) => {
  let state = store.getState() as RootState;
  let accessToken = state.auth.accessToken;

  try {
    // Attempt the request with the current access token
    return await request(accessToken, ...args);
  } catch (error) {
    // If token is invalid (401), try refreshing the token
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      try {
        // Dispatch the refreshToken thunk to get a new access token
        const refreshAction = await store.dispatch(refreshToken());
        if (refreshToken.fulfilled.match(refreshAction)) {
          // Get the updated access token from the state
          state = store.getState() as RootState;
          accessToken = state.auth.accessToken;

          // Retry the original request with the new token
          return await request(accessToken, ...args);
        }
      } catch (refreshError) {
        // If refreshing fails, log the user out and throw an error
        store.dispatch(logout());
        throw new Error("Session expired. Please log in again.");
      }
    }

    // Re-throw any other errors
    throw error;
  }
};

export const fetchProtectedData = async (): Promise<any> => {
  return protectedApi(async (token: string) => {
    const response = await api.get('/protected-data', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  });
};

// Login function for user authentication
export const login = async (username: string, password: string): Promise<void> => {
  try {
    // Dispatch the loginUser thunk, which handles the API request and stores the tokens
    const resultAction = await store.dispatch(loginUser({ username, password }));

    // Check if the login was successful
    if (loginUser.fulfilled.match(resultAction)) {
      console.log("Login successful");
    } else {
      console.error("Login failed:", resultAction.payload);
      throw new Error(resultAction.payload || 'Login failed');
    }
  } catch (error) {
    console.error("Login error:", error);
    throw new Error("Invalid login credentials");
  }
};

// Logout function to clear tokens and log the user out
export const logoutUser = (): void => {
  // Dispatch the Redux logout action to clear the state
  store.dispatch(logout());
  console.log("Logout successful");
};

// Fetch cars with pagination
export const fetchCars = async (page: number, pageSize: number): Promise<CarApiResponse> => {
  const response = await api.get<CarApiResponse>(`/cars?page=${page}&page_size=${pageSize}`);
  return response.data;
};

// Fetch a single car by ID
export const fetchCarById = async (id: number): Promise<Car> => {
  const response = await api.get<Car>(`/cars/${id}`);
  return response.data;
};

export const submitCar = async (carData: Omit<Car, 'id'>, imageFile: File | null): Promise<Car> => {
  const formData = new FormData();

  // Append car fields to FormData (skipping nulls)
  const appendIfNotNull = (key: string, value: string | number | null) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value.toString());
    }
  };

  appendIfNotNull("make", carData.make);
  appendIfNotNull("model", carData.model);
  appendIfNotNull("year", carData.year);
  appendIfNotNull("vin", carData.vin);
  appendIfNotNull("mileage", carData.mileage);
  appendIfNotNull("price", carData.price);
  appendIfNotNull("features", carData.features);
  appendIfNotNull("condition", carData.condition);

  if (imageFile) {
    formData.append("image", imageFile);
  }

  console.log("Submitting Car Data:", Array.from(formData.entries()));

  try {
    const response = await api.post<Car>('/cars/', formData);
    console.log("Car submitted successfully", response.data);
    return response.data; // Return the submitted car data
  } catch (error) {
    let errorMessage = "Failed to submit car";
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error Response Data:", error.response.data);
      errorMessage = error.response.data.errors
        ? `Submission error: ${JSON.stringify(error.response.data.errors)}`
        : error.message;
    } else if (error instanceof Error) {
      console.error("Unexpected error occurred", error);
      errorMessage = error.message;
    } else {
      console.error("An unknown error occurred", error);
    }

    throw new Error(errorMessage); // Throw error to be handled in thunk
  }
};

// Update a car
export const updateCar = async (id: number, carData: CarData, imageFile: File | null): Promise<void> => {
  const formData = new FormData();

  // Append car fields to FormData (skipping nulls)
  const appendIfNotNull = (key: string, value: string | number | null) => {
    if (value !== null) {
      formData.append(key, value.toString());
    }
  };

  appendIfNotNull("make", carData.make);
  appendIfNotNull("model", carData.model);
  appendIfNotNull("year", carData.year);
  appendIfNotNull("vin", carData.vin);
  appendIfNotNull("mileage", carData.mileage);
  appendIfNotNull("price", carData.price);
  appendIfNotNull("features", carData.features);
  appendIfNotNull("condition", carData.condition);

  if (imageFile) {
    formData.append("image", imageFile);
  }

  try {
    const response = await api.put<void>(`/cars/${id}/`, formData); // Update car
    console.log("Car updated successfully", response.data);
  } catch (error) {
    let errorMessage = "Failed to update car";
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error Response Data:", error.response.data);
      errorMessage = error.response.data.errors
        ? `Update error: ${JSON.stringify(error.response.data.errors)}`
        : error.message;
    } else if (error instanceof Error) {
      console.error("Unexpected error occurred", error);
      errorMessage = error.message;
    } else {
      console.error("An unknown error occurred", error);
    }
    
    console.error(errorMessage);
    throw new Error(errorMessage); // Throw error to be handled elsewhere
  }
};

// Update a specific field of a car
export const updateCarFieldAPI = async (
  carId: number,
  field: keyof Car,
  value: any
): Promise<Car> => {
  const response = await api.put<Car>(`/cars/${carId}`, { [field]: value });
  return response.data;
};

// Search cars
export const searchCarsFromAPI = async (searchTerm: string): Promise<CarApiResponse> => {
  const response = await api.get<CarApiResponse>(`/cars?search=${searchTerm}`);
  return response.data;
};

// Delete car
export const deleteCar = async (id: number): Promise<CarApiResponse> => {
  const response = await api.delete<CarApiResponse>(`/cars/${id}`);
  return response.data;
};

// Owner API functions
export const saveOwnerAPI = async (ownerData: Owner): Promise<Owner> => {
  const response = await api.post<Owner>('/owners', ownerData);
  return response.data;
};

export const updateOwnerAPI = async (id: number, ownerData: Partial<Owner>): Promise<Owner> => {
  const response = await api.put<Owner>(`/owners/${id}`, ownerData);
  return response.data;
};

// Sale API functions
export const saveSaleAPI = async (saleData: Sale): Promise<Sale> => {
  const response = await api.post<Sale>('/sales', saleData);
  return response.data;
};

export const updateSaleAPI = async (id: number, saleData: Partial<Sale>): Promise<Sale> => {
  const response = await api.put<Sale>(`/sales/${id}`, saleData);
  return response.data;
};
