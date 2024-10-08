// types/redux/types.ts
import { Car } from '../../types/car'; // Adjust this import based on where your Car type is defined

// Define the shape of your car slice state
export interface CarState {
  cars: Car[];
  loading: boolean;
  error: string | null;
}

// Define the overall RootState type
export interface RootState {
  cars: CarState;
}
