import { SelectCountry } from '@/components/SelectCountry';
import { SelectRegion } from '@/components/SelectRegion';
import { Anchor, Box, Group, Input, Stack, TextInput } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import Link from 'next/link';
import { IGeneralFormDetail } from './useGeneraldetailsForm';

interface Props {
  form: UseFormReturnType<IGeneralFormDetail>;
}
export const GeneralDetails = ({ form }: Props) => {
  return (
    <>
      <Stack>
        <TextInput
          label="First Name"
          placeholder="Your firstname"
          value={form.values.firstName}
          onChange={(event) =>
            form.setFieldValue('firstName', event.currentTarget.value)
          }
          error={form.errors.firstName && form.errors.firstName}
          radius="md"
        />

        <TextInput
          label="Last Name"
          placeholder="Your lastname"
          value={form.values.lastName}
          onChange={(event) =>
            form.setFieldValue('lastName', event.currentTarget.value)
          }
          error={form.errors.lastName && form.errors.lastName}
          radius="md"
        />

        <TextInput
          label="Phone Number"
          placeholder="+233559768577"
          value={form.values.phone}
          onChange={(event) =>
            form.setFieldValue('phone', event.currentTarget.value)
          }
          error={form.errors.phone && form.errors.phone}
          radius="md"
        />
        <Group grow>
          <Box>
            <SelectCountry
              value={form.values.country_id}
              onChange={(value) => form.setFieldValue('country_id', value)}
            />
            {form.errors.country_id && (
              <Input.Error>{form.errors.country_id}</Input.Error>
            )}
          </Box>

          <Box>
            <SelectRegion
              value={form.values.region_id}
              onChange={(value) => form.setFieldValue('region_id', value)}
              selectedCountryId={Number(form.values.country_id)}
            />
            {form.errors.region_id && (
              <Input.Error>{form.errors.region_id}</Input.Error>
            )}
          </Box>
        </Group>

        <TextInput
          label="City"
          placeholder="Achimota"
          value={form.values.city}
          onChange={(event) =>
            form.setFieldValue('city', event.currentTarget.value)
          }
          error={form.errors.city && form.errors.city}
          radius="md"
        />

        <TextInput
          label="Street Address"
          placeholder="Elegant Quarters, No.1 Street"
          value={form.values.street}
          onChange={(event) =>
            form.setFieldValue('street', event.currentTarget.value)
          }
          radius="md"
        />
      </Stack>
    </>
  );
};
