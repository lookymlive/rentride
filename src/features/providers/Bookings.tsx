'use client';
import { StatusRenderer } from '@/components/StatusRenderer';
import { ghCurrency } from '@/const';
import { useSupabase } from '@/context/SupabaseContext';
import { formatDate } from '@/functions';
import { BookingStatus } from '@/models/app';
import { IResBookingProps } from '@/models/res.model';
import {
  Avatar,
  Box,
  Card,
  Divider,
  Flex,
  Loader,
  Menu,
  Table,
  Text,
  Title,
  UnstyledButton,
} from '@mantine/core';
import {
  IconProgressCheck,
  IconSquareRoundedXFilled,
} from '@tabler/icons-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface Props {
  providerId: string;
}

const header = (
  <Table.Tr>
    <Table.Th>Date Booked</Table.Th>
    <Table.Th>User</Table.Th>
    <Table.Th>Pickup Date</Table.Th>
    <Table.Th>Return Date</Table.Th>
    <Table.Th>Price</Table.Th>
    <Table.Th>Status</Table.Th>
  </Table.Tr>
);

export const Bookings = ({ providerId }: Props) => {
  const [bookings, setBookings] = useState<IResBookingProps[]>([]);
  const searchParams = useSearchParams();
  const carId = searchParams.get('car_id');
  const supabase = useSupabase();

  const rows = bookings?.map((item) => (
    <TableRow
      key={item.id}
      bookingId={item.id}
      providerId={providerId}
      carId={Number(carId)}
      dateBooked={new Date(item.created_at)}
      user={item.users}
      pickupDate={new Date(item.pickupDate)}
      returnDate={new Date(item.returnDate)}
      price={item.totalPrice}
      status={item.status as BookingStatus}
    />
  ));

  useEffect(() => {
    const fetchBookings = async () => {
      if (carId && !isNaN(Number(carId))) {
        let { data: bookings } = await supabase
          .from('bookings')
          .select('*, users(firstName, lastName, avatar), cars(make, model)')
          .match({ car_id: carId, provider_id: providerId })
          .order('created_at', { ascending: false });

        if (bookings) {
          setBookings(bookings as any);
        }
      }
    };

    fetchBookings();
  }, [carId, providerId, supabase]);

  return bookings.length > 0 ? (
    <Card my="3rem">
      <Divider
        my="lg"
        label={
          <Title order={4} className="text-default" mb="lg">
            Bookings for {bookings[0].cars?.make} {bookings[0].cars?.model} (
            {bookings.length})
          </Title>
        }
      />

      <Box mah="310px" style={{ overflowY: 'auto' }}>
        <Table striped highlightOnHover>
          <Table.Thead>{header}</Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Box>
    </Card>
  ) : (
    carId && (
      <Card my="3rem">
        <Text fs="italic" ta="center">
          No Bookings Found
        </Text>
      </Card>
    )
  );
};

const bookingActions: {
  display: string;
  value: 'approve' | 'reject';
  color: string;
  icon: ReactNode;
}[] = [
  {
    display: 'Approve',
    value: 'approve',
    color: 'green',
    icon: <IconProgressCheck size={14} />,
  },
  {
    display: 'Reject',
    value: 'reject',
    color: 'red',
    icon: <IconSquareRoundedXFilled size={14} />,
  },
];

interface TableRowProps {
  bookingId: number;
  carId: number;
  providerId: string;
  dateBooked: Date;
  user: { firstName: string; lastName: string; avatar: string };
  pickupDate: Date;
  returnDate: Date;
  price: number;
  status: BookingStatus;
}
export const TableRow = ({
  bookingId,
  carId,
  providerId,
  dateBooked,
  user,
  pickupDate,
  returnDate,
  price,
  status,
}: TableRowProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const supabase = useSupabase();
  const { refresh } = useRouter();

  const handleUpdateBooking = async (value: 'approve' | 'reject') => {
    setIsUpdating(true);
    let bookingStatus = { status: 'pending' };
    let carStatus = { status: 'pending' };

    if (value === 'approve') {
      bookingStatus = {
        status: 'approved',
      };
      carStatus = {
        status: 'booked',
      };
    } else {
      bookingStatus = {
        status: 'rejected',
      };
      carStatus = {
        status: 'available',
      };
    }

    const { error } = await supabase
      .from('bookings')
      .update(bookingStatus)
      .eq('id', bookingId)
      .select();

    if (error) {
      console.log(error);
      return;
    }

    const { error: error2 } = await supabase
      .from('cars')
      .update(carStatus)
      .eq('id', carId)
      .select();

    if (error2) {
      console.log(error2);
    } else {
      toast.info('Booking request has been updated');
      setIsUpdating(false);
      refresh();
    }
  };

  return (
    <Table.Tr>
      <Table.Td>{formatDate(dateBooked)}</Table.Td>
      <Table.Td>
        <Flex align="center" gap={4}>
          <Avatar size="sm" radius="xl" src={user.avatar} />
          <Text>{user.firstName}</Text>
        </Flex>
      </Table.Td>
      <Table.Td>{formatDate(pickupDate)}</Table.Td>
      <Table.Td>{formatDate(returnDate)}</Table.Td>
      <Table.Td>
        {ghCurrency} {price}
      </Table.Td>
      <Table.Td width="100px">
        {status === 'pending' ? (
          <Menu shadow="md" width={200}>
            <Menu.Target>
              {isUpdating ? (
                <Loader size="xs" />
              ) : (
                <UnstyledButton>
                  <StatusRenderer status={status} />
                </UnstyledButton>
              )}
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Take Action</Menu.Label>

              {bookingActions.map((item) => (
                <Menu.Item
                  key={item.value}
                  onClick={() => handleUpdateBooking(item.value)}
                  leftSection={item.icon}
                  color={item.color}
                >
                  {item.display}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        ) : (
          <StatusRenderer status={status} />
        )}
      </Table.Td>
    </Table.Tr>
  );
};
