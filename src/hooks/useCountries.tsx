import { getAllCountriesAsync } from '@/services/supabase.service';
import { useQuery } from '@tanstack/react-query';

export function useCountries() {
  const {
    isLoading,
    data: countries,
    error,
  } = useQuery({
    queryKey: ['countries'],
    queryFn: getAllCountriesAsync,
  });

  return {
    isLoading,
    countries,
    error,
  };
}
