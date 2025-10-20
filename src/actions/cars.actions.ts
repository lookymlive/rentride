'use server';

import { IResCarProps } from '@/models/res.model';
import { Database } from '@/models/supabase';
import { createServerClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

/**
 * Crea un cliente Supabase del lado del servidor con manejo seguro de cookies
 * @returns Cliente Supabase configurado
 */
const createSupabaseServerClient = async () => {
  const cookieStore = await cookies();
  
  return createServerClient<Database>(
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
};

/**
 * Busca vehículos según los parámetros de búsqueda proporcionados
 * @param searchParams - Parámetros de búsqueda (country, region, make)
 * @returns Array de vehículos que coinciden con los criterios
 */
export const getSearchedCars = async (
  searchParams: {
    country?: number;
    region?: number;
    make?: string;
  }
): Promise<IResCarProps[]> => {
  try {
    const supabase = await createSupabaseServerClient();

    // Construir filtros de búsqueda
    const matchFilter: Record<string, any> = {
      country_id: searchParams.country,
      region_id: searchParams.region,
    };

    if (searchParams.make && searchParams.make !== 'all') {
      matchFilter.make = searchParams.make;
    }

    const { data: cars, error } = await supabase
      .from('cars')
      .select(
        'slug, make, model, type, year, transmission, seatingCapacity, images, status, fuelType, pricePerDay'
      )
      .match(matchFilter);

    if (error) {
      console.error('[getSearchedCars] Database error:', error);
      throw new Error('Failed to search cars');
    }

    return cars as IResCarProps[];
  } catch (error) {
    console.error('[getSearchedCars] Error:', error);
    throw new Error('Failed to search cars');
  }
};

/**
 * Obtiene los detalles completos de un vehículo incluyendo información del usuario, proveedor y reseñas
 * @param user - Usuario autenticado
 * @param slug - Slug único del vehículo
 * @returns Objeto con detalles del vehículo, usuario, proveedor y reseñas
 */
export const getCarDetails = async (user: User, slug: string) => {
  try {
    const supabase = await createSupabaseServerClient();

    // Obtener detalles del vehículo
    const { data: car, error: carError } = await supabase
      .from('cars')
      .select()
      .eq('slug', slug)
      .single();

    if (carError || !car) {
      console.error('[getCarDetails] Car not found:', carError);
      throw new Error('Failed to load car details');
    }

    // Obtener datos relacionados en paralelo para mejor rendimiento
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

    if (userRes.error) {
      console.error('[getCarDetails] User error:', userRes.error);
      throw new Error('Failed to load user details');
    }

    if (providerRes.error) {
      console.error('[getCarDetails] Provider error:', providerRes.error);
      throw new Error('Failed to load provider details');
    }

    if (reviewsRes.error) {
      console.error('[getCarDetails] Reviews error:', reviewsRes.error);
      throw new Error('Failed to load reviews');
    }

    return {
      car: car as IResCarProps,
      user: userRes.data as any,
      provider: providerRes.data as any,
      reviews: reviewsRes.data as any,
    };
  } catch (error) {
    console.error('[getCarDetails] Error:', error);
    throw error;
  }
};
