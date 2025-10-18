import { isLoggedIn } from '@/actions/session.actions';
import { ProvidersAccountCreation } from '@/features/providers';

const ProvidersAccountCreationPage = async () => {
  await isLoggedIn();

  return (
    <div>
      <ProvidersAccountCreation />
    </div>
  );
};

export default ProvidersAccountCreationPage;
