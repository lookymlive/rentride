'use client';
import { useAuthContext } from '@/context/AuthContext';
import {
  ActionIcon,
  Box,
  Card,
  Container,
  Divider,
  Flex,
  NavLink,
  Text,
  Title,
} from '@mantine/core';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import { BiLogOutCircle } from 'react-icons/bi';
import { CgProfile } from 'react-icons/cg';
import { IoCarSportSharp } from 'react-icons/io5';

interface Props {
  children: ReactNode;
}
export const AccountLayout = ({ children }: Props) => {
  const { logOut } = useAuthContext();
  const handleSignOut = async () => {
    await logOut();
    redirect('/login');
  };

  return (
    <Container size="xl" my="4rem">
      <Flex>
        <Card withBorder mah={300} w="300px" style={{ zIndex: 1 }}>
          <Box h="60px" bg="orange.6">
            <Title order={4} ta="center" py={16} c="white">
              My Account
            </Title>
          </Box>
          <Box>
            <NavLink
              component={Link}
              href="/my-account/profile"
              label={<Text c="gray.6">Profile</Text>}
              leftSection={<CgProfile size="1.2rem" />}
              py="md"
              color="gray.6"
            />

            <NavLink
              component={Link}
              href="/my-account/bookings"
              label={<Text c="gray.6">Bookings</Text>}
              leftSection={<IoCarSportSharp size="1.2rem" />}
              py="md"
            />
            <Divider />
            <NavLink
              onClick={handleSignOut}
              leftSection={
                <ActionIcon color="red">
                  <BiLogOutCircle size="1.2rem" />
                </ActionIcon>
              }
              label={<Text c="gray.6">Logout</Text>}
              py="md"
            />
          </Box>
        </Card>
        <Box px="xl" w="calc(100% - 300px)">
          {children}
        </Box>
      </Flex>
    </Container>
  );
};
