import { getProviderDetails } from '@/actions/providers.actions';
import { getSession } from '@/actions/session.actions';
import { DashboardLayout } from '@/features/providers/DashboardLayout';
import { MyAccount } from '@/features/providers/MyAccount';
import { redirect } from 'next/navigation';

const ProviderAccountPage = async () => {
  const session = await getSession();

  if (!session) {
    redirect(`/login`);
  }

  const providerDetails = await getProviderDetails(session.user.id);

  return (
    <>
      <DashboardLayout>
        <MyAccount
          providerDetails={{
            ...providerDetails,
            email: session.user.email || '',
          }}
        />
      </DashboardLayout>
    </>
  );
};

export default ProviderAccountPage;
