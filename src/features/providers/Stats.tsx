'use client';
import {
  Group,
  Paper,
  SimpleGrid,
  Text,
  rem,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';

interface StatsGridProps {
  data: {
    title: string;
    icon: React.ReactNode;
    value: string;
  }[];
}

export function StatsGrid({ data }: StatsGridProps) {
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();

  const stats = data.map((stat) => {
    return (
      <Paper withBorder p="md" radius="md" key={stat.title}>
        <Group justify="space-between">
          <Text
            size="xs"
            c="dimmed"
            style={{
              fontWeight: 700,
              textTransform: 'uppercase',
            }}
          >
            {stat.title}
          </Text>
          <div
            style={{
              display: 'inline-block',
              color:
                colorScheme === 'dark'
                  ? theme.colors.dark[3]
                  : theme.colors.gray[4],
            }}
          >
            {stat.icon}
          </div>
        </Group>

        <Group align="flex-end" gap="xs" mt={25}>
          <Text
            style={{
              fontSize: rem(24),
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {stat.value}
          </Text>
        </Group>
      </Paper>
    );
  });
  return (
    <div style={{ padding: rem(16) }}>
      <SimpleGrid
        cols={{ base: 1, md: 2, lg: 4 }}
        spacing={{ base: 8, sm: 'lg' }}
      >
        {stats}
      </SimpleGrid>
    </div>
  );
}
