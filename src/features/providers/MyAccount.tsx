'use client';
import { primaryGradient } from '@/const';
import { useAuthContext } from '@/context/AuthContext';
import { IReqProviderProps } from '@/models/req.model';
import { IResProviderProps } from '@/models/res.model';
import { updateProviderAsync } from '@/services/supabase.service';
import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Input,
  PasswordInput,
  Text,
  Title,
} from '@mantine/core';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BiLogOutCircle } from 'react-icons/bi';
import { toast } from 'react-toastify';
import { CompanyDetails } from './CompanyDetails';

const initialState: Partial<IReqProviderProps> = {
  email: '',
  businessRegistrationNumber: '',
  city: '',
  companyName: '',
  contactName: '',
  phone: '',
  street: '',
  avatar: '',
};

interface Props {
  providerDetails: IResProviderProps;
}

export const MyAccount = ({ providerDetails }: Props) => {
  const { user, logOut } = useAuthContext();
  const [details, setDetails] =
    useState<Partial<IReqProviderProps>>(initialState);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateProviderAccount = async () => {
    setIsUpdating(true);
    const { error } = await updateProviderAsync(details, user?.id || '');

    if (!error) {
      toast.success('Account Updated');
      setIsUpdating(false);
    } else {
      console.log(error);
      setIsUpdating(false);
    }
  };

  const handleSignOut = async () => {
    await logOut();
    redirect('/login');
  };

  useEffect(() => {
    setDetails((prevState) => ({
      ...prevState,
      ...providerDetails,
    }));
  }, [providerDetails, user]);

  return (
    <>
      <Flex justify="flex-end" align="center">
        <ActionIcon onClick={handleSignOut} color="red">
          <BiLogOutCircle size="1.2rem" />
        </ActionIcon>
        <Text
          onClick={handleSignOut}
          size="sm"
          mx="xs"
          className="text-muted"
          style={{ cursor: 'pointer' }}
        >
          Log out
        </Text>
      </Flex>

      <CompanyDetails
        mode="edit"
        companyDetails={details}
        setCompanyDetails={setDetails}
      />

      <Flex justify="flex-end">
        <Button
          variant="gradient"
          gradient={primaryGradient}
          onClick={handleUpdateProviderAccount}
          radius="xl"
          size="md"
          my="sm"
          disabled={isUpdating}
        >
          {isUpdating ? 'Updating...' : 'Update Profile'}
        </Button>
      </Flex>

      <Divider
        label={
          <Title order={4} className="text-default">
            Login Details
          </Title>
        }
        labelPosition="center"
        my="lg"
      />

      <Group grow>
        <Box>
          <Input.Label>Email Address</Input.Label>
          <Input
            type="email"
            placeholder="cargo@gmail.com"
            defaultValue={details.email}
            disabled
          />
        </Box>
        <Box>
          <Input.Label>Current Password</Input.Label>
          <PasswordInput placeholder="xxxxxxxxxx" disabled />
        </Box>
      </Group>

      <Group grow>
        <Box>
          <Input.Label>New Password</Input.Label>
          <PasswordInput placeholder="xxxxxxxxxx" disabled />
        </Box>
        <Box>
          <Input.Label>Confirm New Password</Input.Label>
          <PasswordInput placeholder="xxxxxxxxxx" disabled />
        </Box>
      </Group>

      <Flex justify="flex-end">
        <Button
          variant="gradient"
          gradient={primaryGradient}
          disabled
          radius="xl"
          size="md"
          my="sm"
        >
          <Text ml="xs">Update Login</Text>
        </Button>
      </Flex>
    </>
  );
};
