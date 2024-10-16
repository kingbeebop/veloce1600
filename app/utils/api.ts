// api.ts
import axios from 'axios';
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
  // Get access token from localStorage
  let accessToken = localStorage.getItem('accessToken');

  try {
    // Attempt the request with the current access token
    return await request(accessToken, ...args);
  } catch (error) {
    // If token is invalid (401), try refreshing the token
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error("Session expired. Please log in again.");
    }

    // Re-throw any other errors
    throw error;
  }
};

// Fetch protected data
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
    const response = await api.post('/login', { username, password });
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw new Error("Invalid login credentials");
  }
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

// Submit a car
export const submitCar = async (carData: Omit<Car, 'id'>, imageFile: File | null): Promise<Car> => {
  const formData = new FormData();

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

  try {
    const response = await api.post<Car>('/cars/', formData);
    return response.data;
  } catch (error) {
    let errorMessage = "Failed to submit car";
    if (axios.isAxiosError(error) && error.response) {
      errorMessage = error.response.data.errors
        ? `Submission error: ${JSON.stringify(error.response.data.errors)}`
        : error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
};

// Update a car
export const updateCar = async (id: number, carData: CarData, imageFile: File | null): Promise<Car> => {
  const formData = new FormData();

  console.log("DINOSAUR")

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
    const response = await api.put<Car>(`/cars/${id}/`, formData);
    return response.data;
  } catch (error) {
    let errorMessage = "Failed to update car";
    if (axios.isAxiosError(error) && error.response) {
      errorMessage = error.response.data.errors
        ? `Update error: ${JSON.stringify(error.response.data.errors)}`
        : error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(errorMessage);
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

export const updateOwner = async (id: number, ownerData: Partial<Owner>): Promise<Owner> => {
  const response = await api.put<Owner>(`/owners/${id}`, ownerData);
  return response.data;
};

// Sale API functions
export const saveSale = async (saleData: Sale): Promise<Sale> => {
  const response = await api.post<Sale>('/sales', saleData);
  return response.data;
};

export const updateSale = async (id: number, saleData: Partial<Sale>): Promise<Sale> => {
  const response = await api.put<Sale>(`/sales/${id}`, saleData);
  return response.data;
};
