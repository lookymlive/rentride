'use server';

import {
  IResBookingProps,
  IResCarProps,
  IResProviderProps,
  IResReviewProps,
  IResUserProps,
} from '@/models/res.model';
import { Database } from '@/models/supabase';
import { createServerClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';
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
): Promise<IResUserProps> => {
  const supabase = createServerComponentClient<Database>({ cookies });

  let { data, error } = await supabase
    .from('users')
    .select('*, countries(id, name), regions(id, name)')
    .match({ id: userId })
    .single();

  if (error || data == null) {
    throw new Error('Failed to load user details');
  }

  return data as unknown as IResUserProps;
};
