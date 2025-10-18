'use client';
import { EmailConfirmation } from '@/components/EmailConfirmation';
import { Logo } from '@/components/Header/Logo';
import { useAuthContext } from '@/context/AuthContext';
import {
  Anchor,
  Box,
  Button,
  Divider,
  Group,
  LoadingOverlay,
  Paper,
  Text,
} from '@mantine/core';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { OAuthButtons } from '../OAuthButtons';
import { AuthDetails } from './AuthDetails';
import { useSignupForm } from './useSignupForm';

export function Signup() {
  const signupForm = useSignupForm();
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signupWithEmailPassword } = useAuthContext();

  const handleSignUp = async () => {
    const { email, password } = signupForm.values;

    setIsSubmitting(true);
    const { error } = await signupWithEmailPassword(email, password);

    if (error) {
      toast.error('Error Signing you up');
      setIsSubmitting(false);
    } else {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success(
        'Signup Successful. Please check your email to verify your account'
      );
    }
  };

  return (
    <>
      {isSubmitted ? (
        <EmailConfirmation email={signupForm.values.email} />
      ) : (
        <>
          <LoadingOverlay
            visible={isSubmitting}
            overlayProps={{ radius: 'sm', blur: 2 }}
          />
          <Box px="md" py="xl">
            <Paper maw="450px" radius="md" p="xl" mx="auto" my="xl" withBorder>
              <Text size="lg" fw={500}>
                Welcome to <Logo />
              </Text>
              <OAuthButtons />
              <Divider
                label="Or Continue with"
                labelPosition="center"
                my="md"
              />

              <form onSubmit={signupForm.onSubmit(() => handleSignUp())}>
                <AuthDetails form={signupForm} />
                <FormSubmitSection label="Sign up" />
              </form>

              <Group mt="xl">
                <Anchor
                  component={Link}
                  href="/providers"
                  type="button"
                  color="dimmed"
                  size="xs"
                >
                  Want to Rent your Car? Create Provider Account.
                </Anchor>
              </Group>
            </Paper>
          </Box>
        </>
      )}
    </>
  );
}

export const FormSubmitSection = ({ label }: { label: string }) => {
  return (
    <Group justify="apart" mt="xl">
      <Anchor component={Link} href="/login" type="button" c="dimmed" size="xs">
        Already have an account? Login
      </Anchor>
      <Button type="submit" radius="xl">
        {label}
      </Button>
    </Group>
  );
};
