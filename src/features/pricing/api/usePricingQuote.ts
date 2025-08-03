import { useQuery } from '@tanstack/react-query';
import { getAuthHeaders } from '@/lib/auth';

interface QuoteParams {
  pswId: string;
  originAddress: string;
  startTime?: string;
  endTime?: string;
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
      const url = `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/pricing/quote?pswId=${params.pswId}&originAddress=${encodeURIComponent(params.originAddress)}${params.startTime ? `&startTime=${params.startTime}` : ''}${params.endTime ? `&endTime=${params.endTime}` : ''}`;
      const res = await fetch(url, { headers });
      if (!res.ok) throw new Error('Failed to fetch pricing quote');
      return res.json();
    }
  });
}; 