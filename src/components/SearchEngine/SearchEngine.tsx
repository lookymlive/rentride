import { primaryGradient, today, tomorrow } from '@/const';
import { useAppContext } from '@/context/AppContext';
import { Button, Container, Flex } from '@mantine/core';
import { DateValue } from '@mantine/dates';
import { useEffect } from 'react';
import { SelectCarMake } from '../SelectCarMake';
import { SelectCountry } from '../SelectCountry';
import { SelectDate } from '../SelectDate';
import { SelectRegion } from '../SelectRegion';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useCountries } from '@/hooks/useCountries';
import { useRegions } from '@/hooks/useRegions';
import { carMakes } from '@/data/car-makes';
import { useSearchParams } from 'next/navigation';
import {
  getDefaultSelectedCountry,
  getDefaultSelectedRegion,
} from '@/functions';
import classes from './SearchEngine.module.css';

export const SearchEngine = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    state: { selectedCountry, selectedRegion, carMake, pickupDate, returnDate },
    setCountry,
    setRegion,
    setPickupDate,
    setReturnDate,
    setMake,
  } = useAppContext();
  const { countries } = useCountries();
  const { regions } = useRegions(selectedCountry?.id);

  const handleCarMakeChange = (value: string) => {
    const selectedMake = carMakes.filter((make) => make.value === value)[0];
    setMake(selectedMake);
  };

  const handlePickupDateChange = (value: DateValue) => {
    setPickupDate(value);
  };

  const handleReturnDateChange = (value: DateValue) => {
    setReturnDate(value);
  };

  const handleCountryChange = (value: string) => {
    if (countries) {
      const country = countries.filter(
        (country) => country.id.toString() === value
      )[0];
      setCountry(country);
    }
  };

  const handleRegionChange = (value: string) => {
    if (regions) {
      const newSelectedRegion = regions.filter(
        (region) => region.id.toString() === value
      )[0];
      setRegion(newSelectedRegion);
    }
  };

  const handleSearchCars = () => {
    if (
      selectedCountry &&
      selectedRegion &&
      carMake &&
      pickupDate &&
      returnDate
    ) {
      const params = `country=${selectedCountry.id}&region=${
        selectedRegion.id
      }&make=${
        carMake.value
      }&pickup=${pickupDate.toDateString()}&return=${returnDate.toDateString()}`;
      router.push(`/cars?${params}`);
    } else {
      toast.error('Select value for all search fields');
    }
  };

  useEffect(() => {
    if (countries) {
      const countryId = searchParams.get('country');
      const selectedCountry = getDefaultSelectedCountry(countries, countryId);
      setCountry(selectedCountry);
    }
  }, [countries, searchParams, setCountry]);

  useEffect(() => {
    if (regions) {
      const regionId = searchParams.get('region');
      const selectedRegion = getDefaultSelectedRegion(regions, regionId);
      setRegion(selectedRegion);
    }
  }, [regions, searchParams, setRegion]);

  useEffect(() => {
    const makeParam = searchParams.get('make');
    if (makeParam) {
      const selectedMake = carMakes.filter(
        (make) => make.value === makeParam
      )[0];
      setMake(selectedMake);
    }
  }, [searchParams, setMake]);

  useEffect(() => {
    const pickupParam = searchParams.get('pickup');
    if (pickupParam) {
      const date = new Date(pickupParam);
      setPickupDate(date);
    }
  }, [searchParams, setPickupDate]);

  useEffect(() => {
    const returnParam = searchParams.get('return');
    if (returnParam) {
      const date = new Date(returnParam);
      setReturnDate(date);
    }
  }, [searchParams, setReturnDate]);

  return (
    <Container className={classes.container} size="100%">
      <Flex
        direction={{ base: 'column', sm: 'row' }}
        gap={{ base: 'sm', sm: 'lg' }}
        justify="center"
        align={{ base: 'stretch', sm: 'flex-end' }}
      >
        <SelectCountry
          value={selectedCountry?.id.toString()}
          onChange={handleCountryChange}
        />
        <SelectRegion
          value={selectedRegion?.id.toString()}
          onChange={handleRegionChange}
          selectedCountryId={selectedCountry?.id}
        />
        <SelectCarMake
          value={carMake?.value}
          onChange={handleCarMakeChange}
          addAll={true}
        />
        <SelectDate
          value={pickupDate}
          label="Pickup Date"
          minDate={today}
          onChange={handlePickupDateChange}
        />
        <SelectDate
          label="Return Date"
          value={returnDate}
          minDate={tomorrow}
          onChange={handleReturnDateChange}
        />
        <Button
          onClick={handleSearchCars}
          variant="gradient"
          gradient={primaryGradient}
        >
          Search for Car
        </Button>
      </Flex>
    </Container>
  );
};
