import { useQuery } from '@tanstack/react-query';
import { getAuthHeaders } from '@/lib/auth';

interface QuoteParams {
  pswId: string;
  originAddress: string;
  startTime?: string;
  endTime?: string;
  numApplicants?: number; // Number of PSWs who applied (for demand pricing)
  useAlgorithmic?: boolean; // Whether to use new 5-feature algorithm (default: true)
}

interface QuoteResponse {
  hourlyRate: number;
  distance: string;
  distanceValue: number;
  billing?: {
    basePrice: number;
    taxes: number;
    serviceFee: number;
    total: number;
  };
}

export const usePricingQuote = (enabled: boolean, params: QuoteParams) => {
  return useQuery({
    queryKey: ['pricing-quote', params],
    enabled,
    queryFn: async (): Promise<QuoteResponse> => {
      const headers = await getAuthHeaders();
      // Build query parameters
      const queryParams = new URLSearchParams({
        pswId: params.pswId,
        originAddress: params.originAddress,
        useAlgorithmic: String(params.useAlgorithmic ?? true), // Default to true for new algorithm
        numApplicants: String(params.numApplicants ?? 0), // Default to 0 for new quotes
      });
      
      if (params.startTime) queryParams.append('startTime', params.startTime);
      if (params.endTime) queryParams.append('endTime', params.endTime);
      
      const url = `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/pricing/quote?${queryParams.toString()}`;
      const res = await fetch(url, { headers });
      if (!res.ok) throw new Error('Failed to fetch pricing quote');
      return res.json();
    },
    // Refetch when params change but keep previous data while loading
    staleTime: 0, // Always refetch when dependencies change
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });
}; 