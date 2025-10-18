'use client';
import { primaryGradient } from '@/const';
import { useCarContext } from '@/context/CarContext';
import { IResCarProps } from '@/models/res.model';
import { Box, Button, Divider, Group, Table, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { AddOrEditCar } from './AddOrEditCar';
import { TableRow } from './TableRow';

interface Props {
  cars: IResCarProps[] | null;
}

const header = (
  <Table.Tr>
    <Table.Th>Image</Table.Th>
    <Table.Th>Make</Table.Th>
    <Table.Th>Model</Table.Th>
    <Table.Th>Year</Table.Th>
    <Table.Th>Type</Table.Th>
    <Table.Th>Status</Table.Th>
  </Table.Tr>
);

export const Cars = ({ cars }: Props) => {
  const { resetState } = useCarContext();
  const [opened, { open, close }] = useDisclosure(false);

  const rows = cars?.map((car) => <TableRow key={car.id} car={car} />);

  return (
    <>
      <Divider
        my="lg"
        label={
          <Title order={3} className="text-default">
            All Cars ({cars?.length})
          </Title>
        }
      />

      <AddOrEditCar
        openButton={
          <Group justify="right" mb="md">
            <Button
              onClick={() => {
                resetState();
                open();
              }}
              variant="gradient"
              gradient={primaryGradient}
            >
              <IconPlus /> New Car
            </Button>
          </Group>
        }
        mode="new"
        open={open}
        close={close}
        opened={opened}
      />

      <Box mah="310px" style={{ overflowY: 'auto' }}>
        <Table striped highlightOnHover>
          <Table.Thead>{header}</Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Box>
    </>
  );
};
