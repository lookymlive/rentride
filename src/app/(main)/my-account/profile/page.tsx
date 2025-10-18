import { getSession } from '@/actions/session.actions';
import { getUserDetails } from '@/actions/users.actions';
import { AccountLayout } from '@/features/my-account';
import { Profile } from '@/features/my-account/profile';
import { redirect } from 'next/navigation';

const ProfilePage = async () => {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const user = await getUserDetails(session.user.id);

  return (
    <AccountLayout>
      <Profile
        email={session.user.email}
        id={session.user.id}
        userDetails={user}
      />
    </AccountLayout>
  );
};

export default ProfilePage;
