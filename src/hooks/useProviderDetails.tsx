import {
  getAllCountriesAsync,
  getProviderDetailsAsync,
} from '@/services/supabase.service';
import { useQuery } from '@tanstack/react-query';

export function useProviderDetails(provider_id?: string) {
  const {
    isLoading,
    data: providerDetails,
    error,
  } = useQuery({
    queryKey: ['provider', provider_id],
    queryFn: () => getProviderDetailsAsync(provider_id),
    enabled: provider_id != null,
  });

  return {
    isLoading,
    providerDetails,
    error,
  };
}
