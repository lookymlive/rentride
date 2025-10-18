import { optionsFilter } from '@/functions';
import { useCountries } from '@/hooks/useCountries';
import { Select, SelectProps } from '@mantine/core';
import { ReactNode } from 'react';

interface Props extends Omit<SelectProps, 'data'> {
  label?: ReactNode;
  value?: string;
  onChange?: (value: string) => void;
}

export const SelectCountry = ({ label, value, onChange }: Props) => {
  const { isLoading, countries } = useCountries();

  return (
    <Select
      width="100%"
      label={label || 'Country'}
      placeholder="Ghana"
      data={
        countries
          ? countries.map((country) => ({
              label: country.name,
              value: country.id.toString(),
            }))
          : []
      }
      disabled={isLoading}
      value={value}
      onChange={onChange}
      searchable
      maxDropdownHeight={280}
      nothingFoundMessage="Nothing found"
      filter={optionsFilter}
    />
  );
};
