import { isLoggedIn } from '@/actions/session.actions';
import { Login } from '@/features/auth/Login';

const LoginPage = async () => {
  await isLoggedIn();

  return (
    <>
      <Login />
    </>
  );
};

export default LoginPage;
