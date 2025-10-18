'use server';

import {
  IResBookingProps,
  IResCarProps,
  IResProviderProps,
  IResReviewProps,
  IResUserProps,
} from '@/models/res.model';
import { Database } from '@/models/supabase';
import {
  User,
  createServerComponentClient,
} from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const getUserBookings = async (
  userId: string
): Promise<IResBookingProps[]> => {
  const supabase = createServerComponentClient<Database>({ cookies });

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
