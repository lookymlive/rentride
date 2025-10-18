import { getProviderCars } from '@/actions/providers.actions';
import { getSession } from '@/actions/session.actions';
import { Bookings } from '@/features/providers/Bookings';
import { Cars } from '@/features/providers/Cars';
import { DashboardLayout } from '@/features/providers/DashboardLayout';
import { redirect } from 'next/navigation';

const ProviderCarsPage = async () => {
  const session = await getSession();

  if (!session) {
    redirect(`/login`);
  }
  const cars = await getProviderCars(session.user);

  return (
    <>
      <DashboardLayout>
        <Cars cars={cars} />
        <Bookings providerId={session.user.id} />
      </DashboardLayout>
    </>
  );
};

export default ProviderCarsPage;
