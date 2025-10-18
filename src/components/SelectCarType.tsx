import { optionsFilter } from '@/functions';
import { Select } from '@mantine/core';
import { ReactNode, useEffect } from 'react';

interface Props {
  label?: ReactNode;
  value?: string;
  onChange?: (value: string) => void;
  addAny?: boolean;
  required?: boolean;
}

const carTypes = [
  { label: 'Any', value: 'Any' },
  { label: 'Sedan', value: 'Sedan' },
  { label: 'Luxury Sedan', value: 'Luxury Sedan' },
  { label: 'Electric Sedan', value: 'Electric Sedan' },
  { label: 'SUV', value: 'SUV' },
  { label: 'Off-Road SUV', value: 'Off-Road SUV' },
  { label: 'Convertible', value: 'Convertible' },
  { label: 'Hatchback', value: 'Hatchback' },
  { label: 'Sports Car', value: 'Sports Car' },
  { label: 'Van', value: 'Van' },
  { label: 'Bus', value: 'Bus' },
  { label: 'Truck', value: 'Truck' },
  { label: 'Compact Car', value: 'Compact' },
  { label: 'Coupe', value: 'Coupe' },
  { label: 'Wagon', value: 'Wagon' },
  { label: 'Pick-Up', value: 'Pick-Up' },
];

export const SelectCarType = ({
  label,
  value,
  onChange,
  addAny,
  required = false,
}: Props) => {
  useEffect(() => {
    if (!addAny) {
      carTypes.filter((item) => item.value.toLowerCase() !== 'any');
    }
  }, [addAny]);

  return (
    <Select
      width="100%"
      label={label || 'Body Type'}
      placeholder="Sedan"
      data={carTypes}
      value={value}
      onChange={onChange}
      maxDropdownHeight={280}
      required={required}
      nothingFoundMessage="Nothing found"
      filter={optionsFilter}
    />
  );
};
