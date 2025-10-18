import { ComboboxItem, OptionsFilter } from '@mantine/core';
import { IResCountryProps, IResRegionProps } from './models/res.model';

export const getDefaultSelectedCountry = (
  countries: IResCountryProps[],
  countryId: string | null
): IResCountryProps => {
  if (countryId) {
    return countries.filter(
      (country) => country.id.toString() === countryId
    )[0];
  }
  return countries[0];
};

export const getDefaultSelectedRegion = (
  regions: IResRegionProps[],
  regionId: string | null
): IResCountryProps => {
  if (regionId) {
    return regions.filter((region) => region.id.toString() === regionId)[0];
  }
  return regions[0];
};

export function formatDate(inputDate: Date | string): string {
  let date: Date;

  // Convert the input to a Date object if it's a string
  if (typeof inputDate === 'string') {
    date = new Date(inputDate);
  } else if (inputDate instanceof Date) {
    date = inputDate;
  } else {
    throw new Error('Invalid input. Please provide a Date or a date string.');
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  };

  const formattedDate = date.toLocaleString('en-US', options);
  return formattedDate;
}

export const optionsFilter: OptionsFilter = ({ options, search }) => {
  const filtered = (options as ComboboxItem[]).filter((option) =>
    option.label?.toLowerCase().trim().includes(search.toLowerCase().trim())
  );

  filtered.sort((a, b) => a.label.localeCompare(b.label));
  return filtered;
};
