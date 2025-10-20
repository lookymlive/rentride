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
 * Obtiene todos los vehículos de un proveedor específico
 * @param user - Usuario proveedor autenticado
 * @returns Array de vehículos del proveedor
 */
export const getProviderCars = async (user: User): Promise<IResCarProps[]> => {
  try {
    const supabase = await createSupabaseServerClient();

    const { data: cars, error } = await supabase
      .from('cars')
      .select('*')
      .eq('provider_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[getProviderCars] Database error:', error);
      throw new Error('Failed to load cars');
    }

    if (!cars) {
      return [];
    }

    return cars as IResCarProps[];
  } catch (error) {
    console.error('[getProviderCars] Error:', error);
    throw new Error('Failed to load cars');
  }
};

/**
 * Obtiene todas las reseñas de un proveedor específico
 * @param user - Usuario proveedor autenticado
 * @returns Array de reseñas del proveedor con información del usuario
 */
export const getProviderReviews = async (
  user: User
): Promise<IResReviewProps[]> => {
  try {
    const supabase = await createSupabaseServerClient();

    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('*, users(firstName, lastName)')
      .eq('provider_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[getProviderReviews] Database error:', error);
      throw new Error('Failed to load reviews');
    }

    if (!reviews) {
      return [];
    }

    return reviews as unknown as IResReviewProps[];
  } catch (error) {
    console.error('[getProviderReviews] Error:', error);
    throw new Error('Failed to load reviews');
  }
};

/**
 * Obtiene los detalles completos de un proveedor
 * @param providerId - ID del proveedor
 * @returns Detalles completos del proveedor
 */
export const getProviderDetails = async (
  providerId: string
): Promise<IResProviderProps> => {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from('providers')
      .select('*')
      .match({ id: providerId })
      .single();

    if (error) {
      console.error('[getProviderDetails] Database error:', error);
      throw new Error('Failed to load provider details');
    }

    if (!data) {
      throw new Error('Provider not found');
    }

    return data as IResProviderProps;
  } catch (error) {
    console.error('[getProviderDetails] Error:', error);
    throw error;
  }
};
