export interface Car {
    id: number;  // Assuming you have an ID field for each car
    make: string;
    model: string;
    year: number;
    vin: string;
    mileage: number;
    price: number;  // Decimal values can be represented as numbers in TypeScript
    features: string;
    condition: 'new' | 'used' | 'classic';  // Use union types for conditions
    image?: string;  // Optional field
    owner: number | null;  // Assuming owner is represented by user ID, nullable
    created_at: string;  // ISO string representation of the date
    updated_at: string;  // ISO string representation of the date
  }
  