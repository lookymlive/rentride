import { IReqProviderProps, IReqUserProps } from '@/models/req.model';
import { IResCountryProps, IResRegionProps } from '@/models/res.model';
import { Database } from '@/models/supabase';
import { createBrowserClient } from '@supabase/ssr';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

/**
 * Cliente Supabase para uso en el navegador (client-side)
 * Este cliente se inicializa una sola vez y se reutiliza en toda la aplicación
 */
export const supabaseClient = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Obtiene todos los países disponibles en el sistema
 * @returns Array de países con su información completa
 * @throws Error si falla la consulta a la base de datos
 */
export const getAllCountriesAsync = async (): Promise<IResCountryProps[]> => {
  try {
    const { data: countries, error } = await supabaseClient
      .from('countries')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('[getAllCountriesAsync] Database error:', error);
      throw new Error('Failed to load countries');
    }

    return countries as IResCountryProps[];
  } catch (error) {
    console.error('[getAllCountriesAsync] Error:', error);
    throw new Error('Countries could not be loaded');
  }
};

/**
 * Obtiene todas las regiones de un país específico
 * @param country_id - ID del país (opcional)
 * @returns Array de regiones del país o array vacío si no se proporciona country_id
 * @throws Error si falla la consulta a la base de datos
 */
export const getRegionsAsync = async (
  country_id?: number
): Promise<IResRegionProps[]> => {
  try {
    if (!country_id) {
      return [];
    }

    const { data: regions, error } = await supabaseClient
      .from('regions')
      .select('*')
      .eq('country_id', country_id)
      .order('name', { ascending: true });

    if (error) {
      console.error('[getRegionsAsync] Database error:', error);
      throw new Error('Failed to load regions');
    }

    return regions as IResRegionProps[];
  } catch (error) {
    console.error('[getRegionsAsync] Error:', error);
    throw new Error('Regions could not be loaded');
  }
};

/**
 * Interfaz para la vista general de un proveedor
 */
interface ProviderOverviewProps {
  companyName: string | null;
  avatar: string | null;
  country_id: number | null;
  region_id: number | null;
}

/**
 * Obtiene los detalles básicos de un proveedor
 * @param providerId - ID del proveedor
 * @returns Información básica del proveedor (nombre, avatar, ubicación)
 * @throws Error si el proveedor no existe o falla la consulta
 */
export const getProviderDetailsAsync = async (
  providerId?: string
): Promise<ProviderOverviewProps> => {
  try {
    if (!providerId) {
      throw new Error('Provider ID is required');
    }

    const { data: provider, error } = await supabaseClient
      .from('providers')
      .select('companyName, avatar, country_id, region_id')
      .match({ id: providerId })
      .single();

    if (error) {
      console.error('[getProviderDetailsAsync] Database error:', error);
      throw new Error('Failed to load provider details');
    }

    if (!provider) {
      throw new Error('Provider not found');
    }

    return provider;
  } catch (error) {
    console.error('[getProviderDetailsAsync] Error:', error);
    throw error;
  }
};

/**
 * Crea un nuevo usuario en la base de datos
 * @param user - Datos del usuario a crear
 * @returns Respuesta de Supabase con el usuario creado
 * @throws Error si falla la inserción
 */
export const addUserAsync = async (
  user: IReqUserProps
): Promise<PostgrestSingleResponse<any>> => {
  try {
    const res = await supabaseClient
      .from('users')
      // @ts-ignore - Los tipos generados de Supabase no coinciden exactamente con IReqUserProps
      .insert([user])
      .select()
      .single();

    if (res.error) {
      console.error('[addUserAsync] Database error:', res.error);
    }

    return res;
  } catch (error) {
    console.error('[addUserAsync] Error:', error);
    throw error;
  }
};

/**
 * Actualiza los detalles de un usuario existente
 * @param updatedDetails - Campos a actualizar
 * @param id - ID del usuario
 * @returns Respuesta de Supabase con el usuario actualizado
 * @throws Error si falla la actualización
 */
export const updateUserAsync = async (
  updatedDetails: any,
  id: string
): Promise<PostgrestSingleResponse<any>> => {
  try {
    if (!id) {
      throw new Error('User ID is required');
    }

    const res = await supabaseClient
      .from('users')
      // @ts-ignore - Los tipos generados de Supabase no coinciden exactamente con los campos actualizados
      .update(updatedDetails)
      .eq('id', id)
      .select()
      .single();

    if (res.error) {
      console.error('[updateUserAsync] Database error:', res.error);
    }

    return res;
  } catch (error) {
    console.error('[updateUserAsync] Error:', error);
    throw error;
  }
};

/**
 * Crea un nuevo proveedor en la base de datos
 * @param provider - Datos del proveedor a crear
 * @returns Respuesta de Supabase con el proveedor creado
 * @throws Error si falla la inserción
 */
export const addProviderAsync = async (
  provider: IReqProviderProps
): Promise<PostgrestSingleResponse<any>> => {
  try {
    const res = await supabaseClient
      .from('providers')
      // @ts-ignore - Los tipos generados de Supabase no coinciden exactamente con IReqProviderProps
      .insert([provider])
      .select()
      .single();

    if (res.error) {
      console.error('[addProviderAsync] Database error:', res.error);
    }

    return res;
  } catch (error) {
    console.error('[addProviderAsync] Error:', error);
    throw error;
  }
};

/**
 * Actualiza los detalles de un proveedor existente
 * @param updatedDetails - Campos a actualizar
 * @param id - ID del proveedor
 * @returns Respuesta de Supabase con el proveedor actualizado
 * @throws Error si falla la actualización
 */
export const updateProviderAsync = async (
  updatedDetails: any,
  id: string
): Promise<PostgrestSingleResponse<any>> => {
  try {
    if (!id) {
      throw new Error('Provider ID is required');
    }

    const res = await supabaseClient
      .from('providers')
      // @ts-ignore - Los tipos generados de Supabase no coinciden exactamente con los campos actualizados
      .update(updatedDetails)
      .eq('id', id)
      .select()
      .single();

    if (res.error) {
      console.error('[updateProviderAsync] Database error:', res.error);
    }

    return res;
  } catch (error) {
    console.error('[updateProviderAsync] Error:', error);
    throw error;
  }
};

/**
 * Obtiene todos los detalles de un proveedor
 * @param providerId - ID del proveedor
 * @returns Respuesta de Supabase con todos los datos del proveedor
 * @throws Error si falla la consulta
 */
export const getProviderAsync = async (
  providerId: string
): Promise<PostgrestSingleResponse<any>> => {
  try {
    if (!providerId) {
      throw new Error('Provider ID is required');
    }

    const res = await supabaseClient
      .from('providers')
      .select('*')
      .match({ id: providerId })
      .single();

    if (res.error) {
      console.error('[getProviderAsync] Database error:', res.error);
    }

    return res;
  } catch (error) {
    console.error('[getProviderAsync] Error:', error);
    throw error;
  }
};
