import { isLoggedIn } from '@/actions/session.actions';
import { Signup } from '@/features/auth/Signup/Signup';

export const dynamic = 'force-dynamic';

const SignupPage = async () => {
  await isLoggedIn();

  return (
    <>
      <Signup />
    </>
  );
};

export default SignupPage;
