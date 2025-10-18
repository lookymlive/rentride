import { getCarDetails } from '@/actions/cars.actions';
import { isProviderSession, getSession } from '@/actions/session.actions';
import { CarDetails } from '@/features/cars/details/CarDetails';
import { redirect } from 'next/navigation';
import React from 'react';

interface CarDetailsPageProps {
  params: any;
  searchParams: any;
}

const CarDetailsPage = async ({ params }: CarDetailsPageProps) => {
  const session = await getSession();

  if (!session) {
    redirect(`/login`);
  }

  await isProviderSession();

  if (!params.slug) {
    redirect('/');
  }

  const {
    car,
    user: userDetails,
    provider,
    reviews,
  } = await getCarDetails(session.user, params.slug);

  return (
    <>
      <CarDetails
        car={car}
        user={userDetails}
        provider={provider}
        reviews={reviews || []}
      />
    </>
  );
};

export default CarDetailsPage;
