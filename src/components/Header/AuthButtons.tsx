import { primaryGradient } from '@/const';
import { Button, Group } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import React from 'react';
import { ProfileMenu } from '../ProfileMenu';
import Link from 'next/link';
import { useAuthContext } from '@/context/AuthContext';

export const AuthButtons = () => {
  const smallScreen = useMediaQuery(`(max-width: 991px)`);
  const { session } = useAuthContext();

  return (
    <Group grow={smallScreen}>
      {!session ? (
        <>
          <Button component={Link} href="/login" variant="default">
            Log in
          </Button>
          <Button
            component={Link}
            href="/signup"
            variant="gradient"
            gradient={primaryGradient}
          >
            Sign up
          </Button>
        </>
      ) : (
        <ProfileMenu />
      )}
    </Group>
  );
};
