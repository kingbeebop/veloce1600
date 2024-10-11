// utils/filterCars.ts
import { Car } from '../types/car';

export const filterCars = (cars: Car[], filters: {
  searchTerm?: string;
  priceFilter?: { operator: 'greater' | 'less'; value: number } | null;
  conditionFilter?: 'New' | 'Used' | 'Classic' | null;
}) => {
  const { searchTerm, priceFilter, conditionFilter } = filters;

  // Start with all cars
  let filteredCars = [...cars];

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

  return filteredCars;
};
