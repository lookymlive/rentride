import { SelectCarMake } from '@/components/SelectCarMake';
import { SelectCarType } from '@/components/SelectCarType';
import { SelectFuelType } from '@/components/SelectFuelType';
import { Uploader } from '@/components/Uploader';
import { primaryGradient, today } from '@/const';
import { useAuthContext } from '@/context/AuthContext';
import { useCarContext } from '@/context/CarContext';
import { CurrentMode } from '@/models/app';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  CloseButton,
  Divider,
  Drawer,
  Flex,
  Group,
  Input,
  NumberInput,
  SegmentedControl,
  SimpleGrid,
  Space,
  Textarea,
} from '@mantine/core';
import { YearPickerInput } from '@mantine/dates';
import { CldUploadWidgetResults } from 'next-cloudinary';
import { useRouter } from 'next/navigation';
import { JSXElementConstructor, ReactElement, ReactNode } from 'react';
import { toast } from 'react-toastify';
import { isValidCarDetails } from './isValidCarDetails';
import { useSupabase } from '@/context/SupabaseContext';
import { useProviderDetails } from '@/hooks/useProviderDetails';

interface Props {
  openButton: ReactElement<any, string | JSXElementConstructor<any>>;
  mode: CurrentMode;
  opened: boolean;
  open: () => void;
  close: () => void;
}
export function AddOrEditCar({ openButton, mode, opened, open, close }: Props) {
  const { user } = useAuthContext();
  const {
    state: carDetails,
    updateProperty,
    addCarImage,
    removeImage,
    resetState,
  } = useCarContext();
  const supabase = useSupabase();
  const { refresh } = useRouter();
  const { providerDetails } = useProviderDetails(user?.id);

  const handleUploadCarImages = async (result: CldUploadWidgetResults) => {
    const info: any = result?.info;
    addCarImage(info.secure_url);
  };

  const handleAddOtherFeatures = (value: string) => {
    let features = [];
    if (value.includes('|')) {
      features = value
        .split('|')
        .filter((item) => item.trim() !== '|' && item.trim() !== '')
        .map((feature) => feature.trim());
    } else {
      features = [value];
    }
    updateProperty('otherFeatures', features);
  };

  const handleAddNewCar = async () => {
    const { isValid, message } = isValidCarDetails(carDetails);

    if (isValid) {
      const details: any = {
        ...carDetails,
        maximumRentalPeriodInDays: carDetails.maximumRentalPeriodInDays || -1,
        provider_id: user?.id,
        country_id: providerDetails?.country_id,
        region_id: providerDetails?.region_id,
      };

      if (mode === 'new') {
        const { data, error } = await supabase
          .from('cars')
          .insert([details])
          .select();

        if (data) {
          toast.success('Car added successfully');
          resetState();
          close();
          refresh();
        }

        if (error) {
          toast.error(
            'Failed to add new car. Check your internet and try again later'
          );
        }
      }

      if (mode === 'edit') {
        const clonedDetails = { ...details };
        delete clonedDetails['id'];
        delete clonedDetails['created_at'];

        const { data, error } = await supabase
          .from('cars')
          .update(clonedDetails)
          .eq('id', details.id)
          .select();

        if (data) {
          toast.success('Car updated successfully');
          resetState();
          close();
          refresh();
        }

        if (error) {
          toast.error(
            'Failed to update car. Check your internet and try again later'
          );
        }
      }
    } else {
      toast.error(message);
    }
  };

  return (
    <>
      <Drawer
        position="right"
        size="xl"
        opened={opened}
        onClose={close}
        title="Add New Car"
        // without this prop, opening the drawer in prod will throw a client side exception
        transitionProps={{
          transition: 'slide-left',
        }}
      >
        <Divider mb="1rem" />

        <Uploader
          onUpload={handleUploadCarImages}
          options={{
            maxFiles: 6,
            multiple: true,
            singleUploadAutoClose: false,
            showUploadMoreButton: false,
            folder: 'car-go-rentals/cars',
          }}
        />
        <Flex wrap="wrap" gap={8} mb="2rem" my="0.5rem">
          {carDetails.images.map((image, i) => (
            <CarImage key={i} url={image} removeImage={removeImage} />
          ))}
        </Flex>

        <Group grow my="sm">
          <Box>
            <Input.Label required={!carDetails.description}>
              Description
            </Input.Label>
            <Textarea
              value={carDetails.description}
              onChange={(e) => updateProperty('description', e.target.value)}
              placeholder="add a brief description of your vehicle for users"
            />
          </Box>
        </Group>
        <GridLayout>
          <SelectCarType
            required={!carDetails.type}
            value={carDetails.type}
            onChange={(value) => updateProperty('type', value)}
          />
          <SelectCarMake
            value={carDetails.make}
            onChange={(value) => updateProperty('make', value)}
            required={!carDetails.make}
          />
          <Box>
            <Input.Label required={!carDetails.model}>Model</Input.Label>
            <Input
              type="text"
              placeholder="Car model"
              value={carDetails.model}
              onChange={(e) => updateProperty('model', e.target.value)}
            />
          </Box>

          <YearPickerInput
            required={!carDetails.year}
            label="Year"
            placeholder="Year"
            value={new Date(carDetails.year, 0, 1)}
            maxDate={today}
            onChange={(value) => updateProperty('year', value?.getFullYear())}
          />
          <Box>
            <Input.Label>Transmission</Input.Label>
            <br />
            <SegmentedControl
              w="100%"
              value={carDetails.transmission}
              onChange={(value) => updateProperty('transmission', value)}
              data={[
                { label: 'Automatic', value: 'automatic' },
                { label: 'Manual', value: 'manual' },
              ]}
            />
          </Box>

          <Box>
            <Input.Label required={!carDetails.engineCapacity}>
              Engine Capacity
            </Input.Label>
            <Input
              type="text"
              placeholder="2.5L"
              value={carDetails.engineCapacity}
              onChange={(e) => updateProperty('engineCapacity', e.target.value)}
            />
          </Box>

          <SelectFuelType
            required={!carDetails.fuelType}
            value={carDetails.fuelType}
            onChange={(value) => updateProperty('fuelType', value)}
          />

          <NumberInput
            label="Seating Capacity"
            required={!carDetails.seatingCapacity}
            step={1}
            min={1}
            value={carDetails.seatingCapacity}
            onChange={(value) => updateProperty('seatingCapacity', value)}
          />

          <NumberInput
            label="Number of Bags"
            required={!carDetails.numberOfBags}
            step={1}
            min={1}
            value={carDetails.numberOfBags}
            onChange={(value) => updateProperty('numberOfBags', value)}
          />

          <NumberInput
            label="Number of Doors"
            required={!carDetails.numberOfDoors}
            step={1}
            min={1}
            value={carDetails.numberOfDoors}
            onChange={(value) => updateProperty('numberOfDoors', value)}
          />

          <Box w="100%">
            <Input.Label required={!carDetails.color}>Color</Input.Label>
            <Input
              w="100%"
              type="text"
              placeholder="E.g. Black"
              value={carDetails.color}
              onChange={(e) => updateProperty('color', e.target.value)}
            />
          </Box>
        </GridLayout>

        <Group grow my="sm">
          <Box>
            <Input.Label>
              Other Features. Separate features with {'"|"'}
            </Input.Label>
            <Textarea
              placeholder="E.g. Bluetooth | Backup Camera | Android Screen |  Keyless Entry"
              defaultValue={carDetails.otherFeatures.join(' | ')}
              onChange={(e) => handleAddOtherFeatures(e.target.value)}
            />
          </Box>
        </Group>

        <Group grow mt="1rem">
          <Checkbox
            checked={carDetails.acAvailable}
            onChange={(e) =>
              updateProperty('acAvailable', e.currentTarget.checked)
            }
            label="AC Available"
            color="orange"
          />
          <Checkbox
            label="AC Working"
            color="orange"
            disabled={!carDetails.acAvailable}
            checked={carDetails.acAvailable && carDetails.acWorking}
            onChange={(e) =>
              updateProperty('acWorking', e.currentTarget.checked)
            }
          />
        </Group>

        <Group grow pt="xl">
          <NumberInput
            label="Price Per Day"
            required={!carDetails.pricePerDay}
            value={carDetails.pricePerDay}
            onChange={(value) => updateProperty('pricePerDay', value)}
          />
        </Group>
        <Space pt="xl" />
        <GridLayout>
          <NumberInput
            label="Minimum Rental Period (Days)"
            required={!carDetails.minimumRentalPeriodInDays}
            step={1}
            min={1}
            value={carDetails.minimumRentalPeriodInDays}
            onChange={(value) =>
              updateProperty('minimumRentalPeriodInDays', value)
            }
          />

          <NumberInput
            label="Maximum Rental Period (Days)"
            step={1}
            min={1}
            value={carDetails.maximumRentalPeriodInDays}
            onChange={(value) =>
              updateProperty('maximumRentalPeriodInDays', value)
            }
          />
        </GridLayout>

        <Flex justify="flex-end" my="lg">
          <Button
            onClick={handleAddNewCar}
            miw="200px"
            variant="gradient"
            gradient={primaryGradient}
          >
            {mode === 'new' ? 'Add Car' : 'Update'}
          </Button>
        </Flex>
      </Drawer>

      <>{openButton}</>
    </>
  );
}

const GridLayout = ({ children }: { children: ReactNode }) => (
  <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
    {children}
  </SimpleGrid>
);

const CarImage = ({
  url,
  removeImage,
}: {
  url: string;
  removeImage: (url: string) => void;
}) => (
  <Box style={{ position: 'relative', display: 'inline-block' }}>
    <Avatar size="xl" src={url} />
    <CloseButton
      variant="filled"
      color="gray"
      onClick={() => removeImage(url)}
      aria-label="Remove image"
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
      }}
    />
  </Box>
);
