import React from 'react';
import { Car } from '../types/car';

interface CarTileProps {
  car: Car;
  onFetchDetails: (id: number) => void;
}

const CarTile: React.FC<CarTileProps> = ({ car, onFetchDetails }) => {
  return (
    <div className="car-tile">
      <h3>{car.make} {car.model}</h3>
      <p>Year: {car.year}</p>
      <button onClick={() => onFetchDetails(car.id)}>Fetch Details</button>
    </div>
  );
};

export default CarTile;
