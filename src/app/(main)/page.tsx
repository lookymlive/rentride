import { isProviderSession } from '@/actions/session.actions';
import { Landing } from '@/features/landing';

export default async function Home() {
  await isProviderSession();

  return (
    <>
      <main>
        <Landing />
      </main>
    </>
  );
}
