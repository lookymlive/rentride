import {
  useMantineColorScheme,
  SegmentedControl,
  Group,
  Center,
  Box,
} from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';

export function ThemeSwitcher() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  return (
    <Group justify="center">
      <SegmentedControl
        value={colorScheme}
        onChange={setColorScheme}
        data={[
          {
            value: 'light',
            label: (
              <Center>
                <IconSun size="1rem" stroke={1.5} />
                <Box ml={10}>Light</Box>
              </Center>
            ),
          },
          {
            value: 'dark',
            label: (
              <Center>
                <IconMoon size="1rem" stroke={1.5} />
                <Box ml={10}>Dark</Box>
              </Center>
            ),
          },
        ]}
      />
    </Group>
  );
}
