import axios from 'axios';
import { Car } from '../types/car'

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Adjust as needed
});

export const fetchCars = () => api.get<Car[]>('/cars');
export const createCar = (carData: Car) => api.post('/cars', carData);
export const updateCar = (id: number, carData: Car) => api.put(`/cars/${id}`, carData);
