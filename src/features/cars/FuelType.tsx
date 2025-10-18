import { SelectFuelType } from '@/components/SelectFuelType';
import { useFiltersContext } from '@/context/FiltersContext';
import React from 'react';

export const FuelType = () => {
  const { state, updateFilterProperty } = useFiltersContext();

  const handleChange = (value: string) => {
    updateFilterProperty('fuelType', value);
  };

  return (
    <SelectFuelType addAny value={state.fuelType} onChange={handleChange} />
  );
};
