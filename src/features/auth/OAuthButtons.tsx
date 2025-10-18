import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { useAuthContext } from '@/context/AuthContext';
import { Button, Group } from '@mantine/core';
import React from 'react';

export const OAuthButtons = () => {
  const { signInWithGoogle } = useAuthContext();

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };
  return (
    <Group grow mb="md" mt="md">
      <Button
        leftSection={<GoogleIcon />}
        variant="default"
        color="gray"
        radius="xl"
        onClick={handleGoogleSignIn}
      >
        Google
      </Button>
    </Group>
  );
};
