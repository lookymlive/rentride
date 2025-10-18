import { getProviderReviews } from '@/actions/providers.actions';
import { getSession } from '@/actions/session.actions';
import { DashboardLayout } from '@/features/providers/DashboardLayout';
import { Reviews } from '@/features/providers/Reviews';
import { redirect } from 'next/navigation';

const ProviderReviewsPage = async () => {
  const session = await getSession();

  if (!session) {
    redirect(`/login`);
  }

  const reviews = await getProviderReviews(session.user);

  return (
    <>
      <DashboardLayout>
        <Reviews reviews={reviews} />
      </DashboardLayout>
    </>
  );
};

export default ProviderReviewsPage;
