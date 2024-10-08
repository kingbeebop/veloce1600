// api.ts
import axios from 'axios';
import { Car } from '../types/car';
import { CarApiResponse } from '../types/apiResponse';
import { Owner } from '../types/owner';
import { Sale } from '../types/sale';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Adjust as needed
});

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

// Create a new car
export const createCar = async (carData: Omit<Car, 'id'>): Promise<Car> => {
  const response = await api.post<Car>('/cars', carData);
  return response.data;
};

// Update a car
export const updateCar = async (id: number, carData: Partial<Car>): Promise<Car> => {
  const response = await api.put<Car>(`/cars/${id}`, carData);
  return response.data;
};

// Save or update a car
export const saveCarToApi = async (carData: Omit<Car, 'id'> | Car): Promise<Car> => {
  if ('id' in carData && carData.id) {
    return await updateCar(carData.id, carData);
  } else {
    return await createCar(carData);
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
