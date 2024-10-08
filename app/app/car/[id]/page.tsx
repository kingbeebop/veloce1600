import React from 'react';
import { Car } from '../../../types/car';

interface CarDetailProps {
  car: Car | null;
  onEdit: () => void;
}

const CarDetail: React.FC<CarDetailProps> = ({ car, onEdit }) => {
  if (!car) {
    return <div>No car details available.</div>;
  }

  return (
    <div className="car-detail">
      <h2>{car.make} {car.model}</h2>
      <p>Year: {car.year}</p>
      <p>Owner: {car.owner}</p>
      <p>Price: ${car.price}</p>
      <button onClick={onEdit}>Edit</button>
    </div>
  );
};

export default CarDetail;
