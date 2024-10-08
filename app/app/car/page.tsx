import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCars, fetchCarById } from '../../redux/slices/carSlice';
import { RootState, AppDispatch } from '../../redux/store';
import CarTile from '../../components/CarTile';

const CarList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { cars, loading, error } = useSelector((state: RootState) => state.cars);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchCars());
    };
    fetchData();
  }, [dispatch]);

  const handleFetchCarById = (id: number) => {
    dispatch(fetchCarById(id));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="car-list">
      {cars.map(car => (
        <CarTile key={car.id} car={car} onFetchDetails={handleFetchCarById} />
      ))}
    </div>
  );
};

export default CarList;
