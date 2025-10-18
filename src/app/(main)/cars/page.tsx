import { getSearchedCars } from '@/actions/cars.actions';
import { isProviderSession } from '@/actions/session.actions';
import { Layout } from '@/features/cars';

interface CarDetailsPageProps {
  searchParams: any;
}

const CarListing = async ({ searchParams }: CarDetailsPageProps) => {
  await isProviderSession();
  const cars = await getSearchedCars(searchParams);

  return (
    <>
      <Layout cars={cars} />
    </>
  );
};

export default CarListing;
