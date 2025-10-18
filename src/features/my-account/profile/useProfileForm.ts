import { IResUserProps } from '@/models/res.model';
import { UseFormReturnType, useForm } from '@mantine/form';

export interface IProfileDetails {
  firstName: string;
  lastName: string;
  country_id: string;
  region_id: string;
  phone: string;
  city: string;
  street: string;
  dateOfBirth: string;
  gender: string;
  avatar: string;
}

export const useProfileForm = (
  user: IResUserProps | null
): UseFormReturnType<IProfileDetails> => {
  const form = useForm({
    initialValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      country_id: user?.countries.id.toString() || '',
      region_id: user?.regions.id.toString() || '',
      phone: user?.phone || '',
      city: user?.city || '',
      street: user?.street || '',
      dateOfBirth: user?.dateOfBirth || '',
      gender: user?.gender || 'male',
      avatar: user?.avatar || '',
    },

    validate: {
      firstName: (value: string) => (!value ? 'First Name is required' : null),
      lastName: (value: string) => (!value ? 'Last Name is required' : null),
      phone: (value: string) => (!value ? 'Phone number is required' : null),
      country_id: (value: string) => (!value ? 'Select your country' : null),
      region_id: (value: string) => (!value ? 'Select your region' : null),
      city: (value: string) => (!value ? 'Enter your city name' : null),
    },
  });

  return form;
};
