import { StatusRenderer } from '@/components/StatusRenderer';
import { ghCurrency } from '@/const';
import { IResCarProps } from '@/models/res.model';
import {
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Image,
  Text,
  Title,
} from '@mantine/core';
import { IconManualGearbox, IconUsers } from '@tabler/icons-react';
import Link from 'next/link';
import { BsFuelPump } from 'react-icons/bs';

interface CardProps {
  car: Partial<IResCarProps>;
}
export const CarCard = ({ car }: CardProps) => {
  return (
    <Card miw={{ base: '100%', lg: '47%' }}>
      <Flex align="flex-end" justify="space-between">
        <Box>
          <Title order={5}>
            {car.make} {car.model} {car.year}
          </Title>
          <Text c="gray.6">{car.type}</Text>
        </Box>
      </Flex>
      <Flex justify="space-between" align="flex-end">
        <Link href={`/cars/${car.slug}`}>
          <Image
            maw={{ base: 200, md: 250 }}
            height="150px"
            radius="md"
            my={8}
            src={car.images?.[0]}
            alt={car.make + ' ' + car.model}
          />
        </Link>
        <Box>
          <Box style={{ textAlign: 'center' }} my="md">
            {car.status && car.status !== 'available' && (
              <StatusRenderer status={car.status} />
            )}
          </Box>

          <Button
            component={Link}
            href={`/cars/${car.slug}`}
            variant="gradient"
            mb="xs"
            disabled={car.status !== 'available'}
          >
            Rent now
          </Button>
        </Box>
      </Flex>
      <Divider />
      <Flex align="center" justify="space-between">
        <Flex align="center" gap={{ base: 4, md: 16 }}>
          <Flex my={8} align="center" title="seating capacity">
            <IconUsers size="16px" color="gray" />
            <Text c="gray.6" size="sm" mx={4}>
              {car.seatingCapacity}
            </Text>
          </Flex>
          <Flex my={8} align="center" title="transmission">
            <IconManualGearbox size="16px" color="gray" />
            <Text c="gray.6" size="sm" mx={4}>
              {car.transmission}
            </Text>
          </Flex>
          <Flex my={8} align="center" title="Fuel type">
            <BsFuelPump size="16px" color="gray" />
            <Text c="gray.6" size="sm" mx={4}>
              {car.fuelType}
            </Text>
          </Flex>
        </Flex>

        <Flex align="flex-end">
          <Text fw="bold" size="lg">
            {ghCurrency}
            {car.pricePerDay}
          </Text>
          <Text size="xs">/day</Text>
        </Flex>
      </Flex>
    </Card>
  );
};
