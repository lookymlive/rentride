'use server';

import {
  IResBookingProps,
  IResUserProps,
} from '@/models/res.model';
import { Database } from '@/models/supabase';
import { createServerClient } from '@supabase/ssr';
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
 * Obtiene todas las reservas de un usuario específico
 * @param userId - ID del usuario
 * @returns Array de reservas del usuario con información del vehículo
 */
export const getUserBookings = async (
  userId: string
): Promise<IResBookingProps[]> => {
  try {
    if (!userId) {
      console.error('[getUserBookings] No userId provided');
      return [];
    }

    const supabase = await createSupabaseServerClient();

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*, cars(slug, make, model, images)')
      .match({ user_id: userId })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[getUserBookings] Database error:', error);
      throw new Error('Failed to load bookings');
    }

    if (!bookings) {
      return [];
    }

    return bookings as unknown as IResBookingProps[];
  } catch (error) {
    console.error('[getUserBookings] Error:', error);
    throw new Error('Failed to load bookings');
  }
};

/**
 * Obtiene los detalles completos de un usuario incluyendo país y región
 * @param userId - ID del usuario
 * @returns Detalles completos del usuario o null si no se encuentra
 */
export const getUserDetails = async (
  userId: string
): Promise<IResUserProps | null> => {
  try {
    if (!userId) {
      console.error('[getUserDetails] No userId provided');
      return null;
    }

    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from('users')
      .select('*, countries(id, name), regions(id, name)')
      .match({ id: userId })
      .single();

    if (error) {
      console.error('[getUserDetails] Database error:', error);
      return null;
    }

    if (!data) {
      console.error('[getUserDetails] No data returned for userId:', userId);
      return null;
    }

    return data as unknown as IResUserProps;
  } catch (error) {
    console.error('[getUserDetails] Error:', error);
    return null;
  }
};
