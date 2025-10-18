import { getRegionsAsync } from '@/services/supabase.service';
import { useQuery } from '@tanstack/react-query';

export function useRegions(country_id?: number) {
  if (country_id) {
  }
  const {
    isLoading,
    data: regions,
    error,
  } = useQuery(['regions', country_id], () => getRegionsAsync(country_id), {
    enabled: country_id != null,
  });

  return {
    isLoading,
    regions,
    error,
  };
}
