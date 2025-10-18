'use server';
import { Database } from '@/models/supabase';
import {
  Session,
  createServerComponentClient,
} from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const getSession = async (): Promise<Session | null> => {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { error, data } = await supabase.auth.getSession();

  if (error) {
    throw new Error('Failed to load session');
  }

  return data.session;
};

// checking if logged in user has provider role
const isProvider = (session: Session) => {
  return (
    session.user?.user_metadata.role &&
    session.user?.user_metadata.role === 'provider'
  );
};

export const isProviderSession = async (): Promise<Session | null> => {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { error, data } = await supabase.auth.getSession();

  if (error) {
    throw new Error('Failed to load session');
  }

  if (data.session && isProvider(data.session)) {
    redirect(`/providers/${data.session.user.id}`);
  }

  return data.session;
};

export const isLoggedIn = async () => {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error('Failed to load session');
  }

  if (data.session) {
    if (isProvider(data.session)) {
      redirect(`/providers/${data.session.user?.id}`);
    } else {
      redirect('/');
    }
  }
};
