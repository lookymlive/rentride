import { getSession } from '@/actions/session.actions';
import { getUserBookings } from '@/actions/users.actions';
import { AccountLayout } from '@/features/my-account';
import { Bookings } from '@/features/my-account/bookings';
import { redirect } from 'next/navigation';

const BookingsPage = async () => {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const bookings = await getUserBookings(session.user.id);

  return (
    <AccountLayout>
      {bookings && <Bookings userId={session.user.id} bookings={bookings} />}
    </AccountLayout>
  );
};

export default BookingsPage;
