'use client';
import { ThemeSwitcher } from '@/components/Header/ThemeSwitcher';
import { useAuthContext } from '@/context/AuthContext';
import { CarContextProvider } from '@/context/CarContext';
import { useProviderDetails } from '@/hooks/useProviderDetails';
import {
  AppShell,
  Avatar,
  Burger,
  Flex,
  Stack,
  Text,
  rem,
  useMantineTheme,
} from '@mantine/core';
import {
  IconCar,
  IconDashboard,
  IconMessage,
  IconUser,
} from '@tabler/icons-react';
import { ReactNode, useState } from 'react';
import { MainLink } from './MainLink';

const data = [
  {
    icon: <IconDashboard size="1rem" />,
    color: 'blue',
    label: 'Dashboard',
    endpoint: '/',
  },
  {
    icon: <IconCar size="1rem" />,
    color: 'violet',
    label: 'My cars',
    endpoint: '/cars',
  },
  {
    icon: <IconMessage size="1rem" />,
    color: 'orange',
    label: 'My Reviews',
    endpoint: '/reviews',
  },
];

interface DashboardProps {
  children: ReactNode;
}
export const DashboardLayout = ({ children }: DashboardProps) => {
  const { user } = useAuthContext();
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();
  const { providerDetails } = useProviderDetails(user?.id);

  return (
    <CarContextProvider>
      <AppShell
        padding="md"
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: 'md',
          collapsed: { mobile: !opened },
        }}
      >
        <AppShell.Header>
          <Flex justify="space-between" align="center" px="md" h="100%">
            <Flex align="center">
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
                hiddenFrom="md"
              />
              <Flex gap={8} align="center">
                <Avatar src={providerDetails?.avatar} size="sm" radius="xl" />
                <Text fw="600" style={{ overflow: 'hidden' }}>
                  {providerDetails?.companyName}
                </Text>
              </Flex>
            </Flex>

            <ThemeSwitcher />
          </Flex>
        </AppShell.Header>

        <AppShell.Navbar px="sm">
          <AppShell.Section style={{ flex: 1 }}>
            <Stack mt="xs">
              {data.map((item, i) => (
                <MainLink
                  key={i}
                  label={item.label}
                  color={item.color}
                  icon={item.icon}
                  link={`/providers/${user?.id}/${item.endpoint}`}
                />
              ))}
            </Stack>
          </AppShell.Section>

          <AppShell.Section>
            <MainLink
              label="Account Settings"
              color="gray"
              icon={<IconUser size="1rem" />}
              link={`/providers/${user?.id}/my-account`}
            />
          </AppShell.Section>
        </AppShell.Navbar>

        <AppShell.Main pt={`calc(${rem(60)} + var(--mantine-spacing-md))`}>
          {children}
        </AppShell.Main>
      </AppShell>
    </CarContextProvider>
  );
};
