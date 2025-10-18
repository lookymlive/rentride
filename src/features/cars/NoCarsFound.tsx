import { Card, Flex, Text, Title } from '@mantine/core';
import { FaBoxOpen } from 'react-icons/fa';

export const NoCarsFound = () => {
  return (
    <Card
      component={Flex}
      justify="center"
      align="center"
      direction="column"
      gap={16}
      withBorder
      style={{ backgroundColor: 'transparent' }}
    >
      <Text className="text-default">
        <FaBoxOpen size="4rem" />
      </Text>
      <Title className="text-muted">No Cars Found</Title>
      <Text c="gray.6">Sorry! No cars found for your search</Text>
    </Card>
  );
};
