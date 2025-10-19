'use server';

import {
  IResBookingProps,
  IResUserProps,
} from '@/models/res.model';
import { Database } from '@/models/supabase';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const getUserBookings = async (
  userId: string
): Promise<IResBookingProps[]> => {
  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  let { data: bookings, error } = await supabase
    .from('bookings')
    .select('*, cars(slug, make, model, images)')
    .match({ user_id: userId })
    .order('created_at', { ascending: false });

  if (error || bookings == null) {
    throw new Error('Failed to load bookings');
  }
  return bookings as unknown as IResBookingProps[];
};

export const getUserDetails = async (
  userId: string
): Promise<IResUserProps | null> => {
  if (!userId) {
    console.error('getUserDetails: No userId provided');
    return null;
  }

  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  let { data, error } = await supabase
    .from('users')
    .select('*, countries(id, name), regions(id, name)')
    .match({ id: userId })
    .single();

  if (error) {
    console.error('getUserDetails error:', error);
    return null;
  }

  if (!data) {
    console.error('getUserDetails: No data returned for userId:', userId);
    return null;
  }

  return data as unknown as IResUserProps;
};
