export interface Car {
  id: number;  // Assuming you have an ID field for each car
  make: string | null;  // Nullable
  model: string | null;  // Nullable
  year: number | null;  // Nullable
  vin: string | null;  // Nullable
  mileage: number | null;  // Nullable
  price: number | null;  // Nullable
  features: string | null;  // Nullable
  condition: 'new' | 'used' | 'classic' | null;  // Nullable
  image?: string | null;  // Optional and nullable
  owner: number | null;  // Assuming owner is represented by user ID, nullable
  created_at: string | null;  // Nullable
  updated_at: string | null;  // Nullable
}

export interface CarData {
  make: string | null;
  model: string |null;
  year: number | null;
  vin: string | null;
  mileage: number | null;
  price: number | null;
  features: string | null;
  condition: string | null;
}