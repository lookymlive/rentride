'use server';

import {
  IResCarProps,
  IResProviderProps,
  IResReviewProps,
} from '@/models/res.model';
import { Database } from '@/models/supabase';
import {
  User,
  createServerComponentClient,
} from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const getProviderCars = async (user: User): Promise<IResCarProps[]> => {
  const supabase = createServerComponentClient<Database>({ cookies });

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
  const supabase = createServerComponentClient<Database>({ cookies });

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
  const supabase = createServerComponentClient<Database>({ cookies });

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
