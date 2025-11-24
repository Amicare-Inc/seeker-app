import { useQuery } from '@tanstack/react-query';
import { getAuth } from 'firebase/auth';

type DistanceResponse = {
  distance: { text: string; value: number };
  duration: { text: string; value: number };
  status: string;
};

export const useDistanceToPsw = (originAddress?: string, destinationAddress?: string) => {
  return useQuery<DistanceResponse>({
    queryKey: ['distance-to-psw', originAddress, destinationAddress],
    queryFn: async () => {
      const token = await getAuth().currentUser?.getIdToken();
      const url = new URL(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/distance/driving`);
      url.search = new URLSearchParams({
        originAddress: String(originAddress),
        destinationAddress: String(destinationAddress),
      }).toString();

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Distance API error: ${response.status} ${text}`);
      }

      return (await response.json()) as DistanceResponse;
    },
    enabled: Boolean(originAddress && destinationAddress),
  });
};