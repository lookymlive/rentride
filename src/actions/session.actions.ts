'use server';
import { Database } from '@/models/supabase';
import { createServerClient } from '@supabase/ssr';
import type { Session } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const getSession = async (): Promise<Session | null> => {
  const cookieStore = await cookies();
  
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

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
  const cookieStore = await cookies();
  
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

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
  const cookieStore = await cookies();
  
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
  
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
