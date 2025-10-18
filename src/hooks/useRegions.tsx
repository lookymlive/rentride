import { getRegionsAsync } from '@/services/supabase.service';
import { useQuery } from '@tanstack/react-query';

export function useRegions(country_id?: number) {
  const {
    isLoading,
    data: regions,
    error,
  } = useQuery({
    queryKey: ['regions', country_id],
    queryFn: () => getRegionsAsync(country_id),
    enabled: country_id != null,
  });

  return {
    isLoading,
    regions,
    error,
  };
}
