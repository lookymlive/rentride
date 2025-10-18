'use client';
// import Map from '@/components/Map/Map';
import { SearchEngine } from '@/components/SearchEngine/SearchEngine';
import { FiltersContextProvider } from '@/context/FiltersContext';
import { IResCarProps } from '@/models/res.model';
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Space,
  Title,
  useMantineColorScheme,
} from '@mantine/core';
import { IconBrandGoogleMaps } from '@tabler/icons-react';
import { useState } from 'react';
import { BodyType } from './BodyType';
import { CarList } from './CarList';
import { FiltersDrawer } from './FiltersDrawer';
import { FuelType } from './FuelType';
import { PriceRange } from './PriceRange';
import { ResetFiltersButton } from './ResetFiltersButton';
import classes from './Styles.module.css';
import { Transmission } from './Transmission';
import { YearModel } from './YearModel';
import dynamic from 'next/dynamic';

// Importing Map component dynamically removes ReferenceError: window is not defined
const Map = dynamic(() => import('@/components/Map/Map'), {
  ssr: false,
});

interface LayoutProps {
  cars: Partial<IResCarProps>[] | null;
}
export const Layout = ({ cars }: LayoutProps) => {
  const [showMap, setShowMap] = useState(false);

  return (
    <FiltersContextProvider>
      <Container className={classes.parentContainer} size="xl" my="sm" py="md">
        <SearchEngine />
        <Flex justify="flex-end">
          <Button
            onClick={() => setShowMap(!showMap)}
            className={classes.mapToggle}
            size="sm"
            variant="subtle"
          >
            <IconBrandGoogleMaps size="16px" />
            {showMap ? 'Hide Map' : <>Show Map</>}
          </Button>
        </Flex>

        {showMap && <Map height="200px" />}

        <Flex
          direction={{ base: 'column', md: 'row' }}
          className={classes.container}
        >
          <Card w={{ base: '100%', md: '350px' }}>
            <Flex align="center" justify="space-between">
              <Title order={4}>Filters</Title>
              <Box display={{ base: 'none', md: 'inline-block' }}>
                <ResetFiltersButton />
              </Box>
              <FiltersDrawer />
            </Flex>
            <Divider my={16} display={{ base: 'none', md: 'block' }} />
            <Box display={{ base: 'none', md: 'block' }}>
              <BodyType />
              <PriceRange />
              <YearModel />
              <Transmission />
              <Space my="lg" />
              <FuelType />
            </Box>
          </Card>
          <CarList cars={cars || []} />
        </Flex>
      </Container>
    </FiltersContextProvider>
  );
};
