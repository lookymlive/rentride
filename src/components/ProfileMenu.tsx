'use client';
import { useAuthContext } from '@/context/AuthContext';
import { useSupabase } from '@/context/SupabaseContext';
import { Avatar, Flex, Menu, Text, UnstyledButton } from '@mantine/core';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BiLogOutCircle } from 'react-icons/bi';
import { CgProfile } from 'react-icons/cg';
import { IoCarSportSharp, IoChevronDown } from 'react-icons/io5';
export function ProfileMenu() {
  const [avatar, setAvatar] = useState('');
  const { logOut, user } = useAuthContext();
  const supabase = useSupabase();

  const handleSignOut = async () => {
    await logOut();
  };

  useEffect(() => {
    const loadUserAvatar = async () => {
      if (user) {
        const { data } = await supabase
          .from('users')
          .select('avatar')
          .eq('id', user.id)
          .single();

        setAvatar(data?.avatar || '');
      }
    };

    loadUserAvatar();
  }, [supabase, user]);

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <UnstyledButton
          component={Flex}
          align="center"
          gap={8}
          variant="subtle"
          py="sm"
        >
          <Avatar src={avatar} radius="xl" />
          <IoChevronDown />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>
          <Text lineClamp={1}>{user?.email}</Text>
        </Menu.Label>
        <Menu.Item
          component={Link}
          href="/my-account/profile"
          leftSection={<CgProfile size="0.8rem" />}
        >
          Profile
        </Menu.Item>
        <Menu.Item
          component={Link}
          href="/my-account/bookings"
          leftSection={<IoCarSportSharp size="0.8rem" />}
        >
          Bookings
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          component="button"
          type="button"
          role="button"
          onClick={handleSignOut}
          color="red"
          leftSection={<BiLogOutCircle size="1rem" />}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
