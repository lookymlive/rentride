import { IReqProviderProps, IReqUserProps } from '@/models/req.model';
import { IResCountryProps, IResRegionProps } from '@/models/res.model';
import { Database } from '@/models/supabase';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

export const supabaseClient = createClientComponentClient<Database>();

export const getAllCountriesAsync = async (): Promise<IResCountryProps[]> => {
  try {
    const { data: countries, error } = await supabaseClient
      .from('countries')
      .select('*');
    if (error) {
      throw new Error(error as any);
    }
    return countries as IResCountryProps[];
  } catch (error) {
    console.log(JSON.stringify(error));
    throw new Error('Countries could not be loaded');
  }
};

export const getRegionsAsync = async (
  country_id?: number
): Promise<IResRegionProps[]> => {
  try {
    if (country_id) {
      const { data: regions } = await supabaseClient
        .from('regions')
        .select('*')
        .eq('country_id', country_id);

      return regions as IResRegionProps[];
    }
    return [];
  } catch (error) {
    throw new Error('Regions could not be loaded');
  }
};

interface ProviderOverviewProps {
  companyName: string | null;
  avatar: string | null;
  country_id: number | null;
  region_id: number | null;
}

export const getProviderDetailsAsync = async (
  providerId?: string
): Promise<ProviderOverviewProps> => {
  let { data: provider, error } = await supabaseClient
    .from('providers')
    .select('companyName, avatar, country_id, region_id')
    .match({ id: providerId })
    .single();

  if (error || provider == null) {
    throw new Error('Failed to load provider details');
  }

  return provider;
};

export const addUserAsync = async (
  user: IReqUserProps
): Promise<PostgrestSingleResponse<any>> => {
  const res = await supabaseClient
    .from('users')
    .insert([user])
    .select()
    .single();
  return res;
};

export const updateUserAsync = async (
  updatedDetails: any,
  id: string
): Promise<PostgrestSingleResponse<any>> => {
  const res = await supabaseClient
    .from('users')
    .update(updatedDetails)
    .eq('id', id)
    .select()
    .single();

  return res;
};

export const addProviderAsync = async (
  provider: IReqProviderProps
): Promise<PostgrestSingleResponse<any>> => {
  const res = await supabaseClient
    .from('providers')
    .insert([provider])
    .select()
    .single();
  return res;
};

export const updateProviderAsync = async (
  updatedDetails: any,
  id: string
): Promise<PostgrestSingleResponse<any>> => {
  const res = await supabaseClient
    .from('providers')
    .update(updatedDetails)
    .eq('id', id)
    .select()
    .single();

  return res;
};

export const getProviderAsync = async (
  providerId: string
): Promise<PostgrestSingleResponse<any>> => {
  const res = await supabaseClient
    .from('providers')
    .select('*')
    .match({ id: providerId })
    .single();

  return res;
};
