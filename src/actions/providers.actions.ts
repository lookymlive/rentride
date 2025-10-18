'use server';

import {
  IResCarProps,
  IResProviderProps,
  IResReviewProps,
} from '@/models/res.model';
import { Database } from '@/models/supabase';
import { createServerClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export const getProviderCars = async (user: User): Promise<IResCarProps[]> => {
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

  let { data: cars, error } = await supabase
    .from('cars')
    .select('*')
    .eq('provider_id', user.id);

  if (error || cars == null) {
    throw new Error('Failed to load cars');
  }
  return cars as IResCarProps[];
};

export const getProviderReviews = async (
  user: User
): Promise<IResReviewProps[]> => {
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

  let { data: reviews, error } = await supabase
    .from('reviews')
    .select('*, users(firstName, lastName)')
    .eq('provider_id', user.id);

  if (error || reviews == null) {
    throw new Error('Failed to load reviews');
  }

  return reviews as unknown as IResReviewProps[];
};

export const getProviderDetails = async (
  providerId: string
): Promise<IResProviderProps> => {
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

  const { data, error } = await supabase
    .from('providers')
    .select('*')
    .match({ id: providerId })
    .single();

  if (error || data == null) {
    throw new Error('Failed to load provider details');
  }

  return data as IResProviderProps;
};
