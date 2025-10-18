'use server';

import { IResCarProps } from '@/models/res.model';
import { Database } from '@/models/supabase';
import { createServerClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export const getSearchedCars = async (
  searchParams: any
): Promise<IResCarProps[]> => {
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

  const matchFilter: any = {
    country_id: searchParams.country,
    region_id: searchParams.region,
  };

  if (searchParams.make && searchParams.make !== 'all') {
    matchFilter.make = searchParams.make;
  }

  let { data: cars } = await supabase
    .from('cars')
    .select(
      'slug, make, model, type, year, transmission, seatingCapacity, images, status, fuelType, pricePerDay'
    )
    .match(matchFilter);

  return cars as IResCarProps[];
};

export const getCarDetails = async (user: User, slug: string) => {
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

  const { data: car, error } = await supabase
    .from('cars')
    .select()
    .eq('slug', slug)
    .single();

  if (error || !car) {
    throw new Error('Failed to load car details');
  }

  const [userRes, providerRes, reviewsRes] = await Promise.all([
    supabase
      .from('users')
      .select('id, firstName, lastName, city, street, regions(name)')
      .match({ id: user.id })
      .single(),
    supabase
      .from('providers')
      .select('companyName, avatar, email, phone')
      .match({ id: (car as any).provider_id })
      .single(),
    supabase
      .from('reviews')
      .select('*, users(firstName, lastName)')
      .match({ car_id: (car as any).id }),
  ]);

  if (userRes.error || providerRes.error || reviewsRes.error) {
    throw new Error('Failed to load car details');
  }

  return {
    car: car as IResCarProps,
    user: userRes.data as any,
    provider: providerRes.data as any,
    reviews: reviewsRes.data as any,
  };
};
