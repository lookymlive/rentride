import {
  Card,
  Divider,
  Flex,
  Grid,
  List,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { IconCheck, IconManualGearbox, IconUsers } from '@tabler/icons-react';
import { GiCarDoor } from 'react-icons/gi';
import classes from './Styles.module.css';

interface Props {
  seatingCapacity: number;
  transmission: string;
  fuelType: string;
  engineCapacity: string;
  otherFeatures: string[];
  acAvailable: boolean;
  acWorking: boolean;
}

export const Features = ({
  seatingCapacity,
  transmission,
  fuelType,
  engineCapacity,
  otherFeatures,
  acAvailable,
  acWorking,
}: Props) => {
  return (
    <>
      <Title order={5} my="xs">
        Features
      </Title>
      <Grid>
        <Grid.Col span={{ base: 12, xs: 6, sm: 3 }}>
          <Card className={classes.mainFeatures} withBorder>
            <IconUsers />
            <Text size="xs">Seating Capacity</Text>
            <Text fw="bold" size="xl">
              {seatingCapacity}
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, xs: 6, sm: 3 }}>
          <Card className={classes.mainFeatures} withBorder>
            <IconManualGearbox />
            <Text size="xs">Transmission</Text>
            <Text fw="bold">{transmission}</Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, xs: 6, sm: 3 }}>
          <Card className={classes.mainFeatures} withBorder>
            <IconUsers />
            <Text size="xs">Fuel Type/EV</Text>
            <Text fw="bold">{fuelType}</Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, xs: 6, sm: 3 }}>
          <Card className={classes.mainFeatures} withBorder>
            <IconUsers />
            <Text size="xs">Engine Capacity</Text>
            <Text fw="bold">{engineCapacity}</Text>
          </Card>
        </Grid.Col>
      </Grid>

      <Grid align="flex-start" my="md">
        {otherFeatures.length !== 0 && (
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Card withBorder>
              <List
                spacing="xs"
                size="sm"
                center
                icon={
                  <ThemeIcon color="blue" size={24} radius="xl">
                    <IconCheck size="1rem" />
                  </ThemeIcon>
                }
              >
                {otherFeatures.map((feature, i) => (
                  <List.Item key={i}>{feature}</List.Item>
                ))}
              </List>
            </Card>
          </Grid.Col>
        )}
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Card withBorder>
            <Flex gap="md" align="center" my="md">
              <GiCarDoor />
              <Text>4 Doors</Text>
            </Flex>
            <Divider mb="md" />
            <Flex gap="md" justify="space-between" align="center" my="md">
              <Text>AC AVAILABLE</Text>
              <Text>{acAvailable ? 'Yes' : 'No'}</Text>
            </Flex>

            <Flex gap="md" justify="space-between" align="center" my="md">
              <Text>AC WORKING</Text>
              <Text>{acWorking ? 'Yes' : 'No'}</Text>
            </Flex>
          </Card>
        </Grid.Col>
      </Grid>
    </>
  );
};
