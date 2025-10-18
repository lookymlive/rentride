import { ProfilePhoto } from '@/components/ProfilePhoto';
import { SelectCountry } from '@/components/SelectCountry';
import { SelectRegion } from '@/components/SelectRegion';
import { primaryGradient } from '@/const';
import { useCountries } from '@/hooks/useCountries';
import { CurrentMode } from '@/models/app';
import { IReqProviderProps } from '@/models/req.model';
import { IResCountryProps } from '@/models/res.model';
import {
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Input,
  Space,
  Text,
  Title,
} from '@mantine/core';
import { Dispatch, SetStateAction, useState } from 'react';
import { BsArrowRight } from 'react-icons/bs';

interface Props {
  mode?: CurrentMode;
  next?: () => void;
  companyDetails: Partial<IReqProviderProps>;
  setCompanyDetails: Dispatch<SetStateAction<Partial<IReqProviderProps>>>;
}
export const CompanyDetails = ({
  mode,
  next,
  companyDetails,
  setCompanyDetails,
}: Props) => {
  const [isNext, setIsNext] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<
    IResCountryProps | undefined
  >(undefined);
  const { countries } = useCountries();

  const updateDetails = (key: keyof IReqProviderProps, value: any) => {
    setCompanyDetails((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const isEditMode = mode != null && mode === 'edit';

  const handleNext = () => {
    const {
      companyName,
      businessRegistrationNumber,
      contactName,
      phone,
      country_id,
      region_id,
      city,
    } = companyDetails;

    if (
      companyName &&
      businessRegistrationNumber &&
      contactName &&
      phone &&
      city &&
      country_id !== -1 &&
      region_id !== -1
    ) {
      next?.();
    } else {
      setIsNext(true);
    }
  };

  const updateAvatar = async (url: string) => {
    updateDetails('avatar', url);
  };

  return (
    <Flex gap="4rem">
      <Box style={{ flexGrow: 1 }}>
        {!isEditMode && (
          <Title c="gray.6" mt="2rem">
            Create New Provider Account
          </Title>
        )}
        <ProfilePhoto
          profileUrl={companyDetails.avatar}
          updateProfile={updateAvatar}
        />
        <Space mt="2rem" />
        <Group grow>
          <Box>
            <Input.Label>Company Name</Input.Label>
            <Input
              type="text"
              placeholder="Company ABC"
              value={companyDetails.companyName}
              onChange={(event) =>
                updateDetails('companyName', event.currentTarget.value)
              }
            />
            {isNext && !companyDetails.companyName && (
              <Input.Error>Company name is require</Input.Error>
            )}
          </Box>

          <Box>
            <Input.Label>Business Registration No.</Input.Label>
            <Input
              type="text"
              placeholder="BNXXXXXXXXXX"
              value={companyDetails.businessRegistrationNumber}
              onChange={(event) =>
                updateDetails(
                  'businessRegistrationNumber',
                  event.currentTarget.value
                )
              }
            />
            {isNext && !companyDetails.businessRegistrationNumber && (
              <Input.Error>Business number is require</Input.Error>
            )}
          </Box>
        </Group>
        <Group grow>
          <Box>
            <Input.Label>Contact Name</Input.Label>
            <Input
              type="text"
              placeholder="John Champion"
              value={companyDetails.contactName}
              onChange={(event) =>
                updateDetails('contactName', event.currentTarget.value)
              }
            />
            {isNext && !companyDetails.contactName && (
              <Input.Error>Contact name is require</Input.Error>
            )}
          </Box>
          <Box my="sm">
            <Input.Label>Phone Number</Input.Label>
            <Input
              type="text"
              placeholder="+233 557869685"
              value={companyDetails.phone}
              onChange={(event) =>
                updateDetails('phone', event.currentTarget.value)
              }
            />
            {isNext && !companyDetails.phone && (
              <Input.Error>Phone number is require</Input.Error>
            )}
          </Box>
        </Group>
        <Box my="lg">
          <Divider
            my="xs"
            label={
              <Title order={4} className="text-default">
                Address
              </Title>
            }
            labelPosition="center"
          />

          <Group grow>
            <Box my="sm">
              <SelectCountry
                value={companyDetails.country_id?.toString()}
                onChange={(value) => {
                  setSelectedCountry(
                    countries?.filter(
                      (country) => country.id.toString() === value
                    )[0]
                  );
                  updateDetails('country_id', value);
                }}
              />
              {isNext && Number(companyDetails.country_id) === -1 && (
                <Input.Error>Select Country</Input.Error>
              )}
            </Box>
            <Box my="sm">
              <SelectRegion
                selectedCountryId={
                  selectedCountry?.id ||
                  countries?.filter(
                    (country) =>
                      country.id === Number(companyDetails.country_id)
                  )[0]?.id
                }
                value={companyDetails.region_id?.toString()}
                onChange={(value) => {
                  updateDetails('region_id', value);
                }}
              />
              {isNext && companyDetails.region_id === -1 && (
                <Input.Error>Select Region</Input.Error>
              )}
            </Box>
          </Group>

          <Group grow align="flex-start">
            <Box my="sm">
              <Input.Label>City</Input.Label>
              <Input
                type="text"
                placeholder="Achimota"
                value={companyDetails.city}
                onChange={(event) =>
                  updateDetails('city', event.currentTarget.value)
                }
              />
              {isNext && !companyDetails.city && (
                <Input.Error>City is required</Input.Error>
              )}
            </Box>
            <Box my="sm">
              <Input.Label>Street</Input.Label>
              <Input
                type="text"
                placeholder="Kaiser Valley St."
                value={companyDetails.street}
                onChange={(event) =>
                  updateDetails('street', event.currentTarget.value)
                }
              />
            </Box>
          </Group>
        </Box>
        {!isEditMode && (
          <Flex justify="flex-end">
            <Button
              variant="subtle"
              gradient={primaryGradient}
              onClick={handleNext}
              radius="xl"
              size="md"
            >
              <Text mr="xs">Next</Text> <BsArrowRight />
            </Button>
          </Flex>
        )}
      </Box>
    </Flex>
  );
};
