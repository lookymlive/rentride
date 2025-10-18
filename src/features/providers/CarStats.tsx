'use client';
import { Divider, Flex, Paper, Text, rem } from '@mantine/core';
import classes from './CarStats.module.css';

const data = [
  { label: 'Sedan', value: 0 },
  { label: 'SUV', value: 0 },
  { label: 'Trucks', value: 0 },
];

export function CarStats() {
  return (
    <>
      <Divider my={16} mx={16} />
      <Flex wrap="wrap" gap={16} m={rem(16)} style={{ flex: 1 }}>
        {data.map((stat) => (
          <Paper className={classes.statCard} key={stat.label} withBorder>
            <Text size="1.5rem" className={classes.title}>
              {stat.label}
            </Text>
            <div>
              <Text className={classes.label}>Total</Text>
              <Text fz="xs" className={classes.value}>
                {stat.value}
              </Text>
            </div>
          </Paper>
        ))}
      </Flex>
    </>
  );
}
