import { useQuery } from '@tanstack/react-query';
import { fetchExploreUsers, fetchExploreUsersWithDistance } from '@/features/userDirectory';
// Query keys
export const userDirectoryKeys = {
  all: ['userDirectory'] as const,
  lists: () => [...userDirectoryKeys.all, 'list'] as const,
  list: (userType: string, currentUserId: string) => [...userDirectoryKeys.lists(), userType, currentUserId] as const,
  withDistance: (userType: string, currentUserId: string) => [...userDirectoryKeys.lists(), userType, currentUserId, 'withDistance'] as const,
};

// Fetch available users
export function useAvailableUsers(userType: 'psw' | 'seeker', currentUserId: string | undefined) {
  return useQuery({
    queryKey: userDirectoryKeys.list(userType, currentUserId || ''),
    queryFn: () => fetchExploreUsers(userType, currentUserId!),
    enabled: !!currentUserId,
  });
}

// Fetch available users with distance
export function useAvailableUsersWithDistance(userType: 'psw' | 'seeker', currentUserId: string | undefined) {
  return useQuery({
    queryKey: userDirectoryKeys.withDistance(userType, currentUserId || ''),
    queryFn: () => fetchExploreUsersWithDistance(userType, currentUserId!),
    enabled: !!currentUserId,
  });
} 