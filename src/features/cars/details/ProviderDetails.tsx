import { Avatar, Box, Flex, Text, Title } from '@mantine/core';

interface Props {
  provider: {
    companyName: string;
    avatar: string;
    email: string;
    phone: string;
  };
}
export const ProviderDetails = ({ provider }: Props) => {
  return (
    <Flex
      justify="space-between"
      align={{ base: 'flex-start', md: 'center' }}
      direction={{ base: 'column', md: 'row' }}
      my={16}
    >
      <Box>
        <Flex align="center" gap={8}>
          <Avatar
            src={provider.avatar}
            style={{ border: '1px solid gray' }}
            radius="xl"
            c="pink"
          />
          <Title order={3} className="text-default">
            {provider.companyName}
          </Title>
        </Flex>
        <Flex ml={46} style={{ fontSize: 'small' }}>
          <Text
            component="a"
            href={`tel:${provider.phone}`}
            className="text-muted"
          >
            {provider.phone}
          </Text>
          <Text mx="xs" className="text-muted">
            |
          </Text>
          <Text
            component="a"
            href={`mailto:${provider.email}`}
            className="text-muted"
          >
            {provider.email}
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
};
