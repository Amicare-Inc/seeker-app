// src/hooks/useAvailableUsers.ts
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useAvailableUsers, useAvailableUsersWithDistance } from '@/features/userDirectory/api/queries';
import { User } from '@/types/User';

export const useHomeTab = (isPsw: boolean, withDistance: boolean = false) => {
    const currentUserId = useSelector((state: RootState) => state.user.userData?.id);
    const userType = isPsw ? 'psw' : 'seeker';
    
    const usersQuery = withDistance 
        ? useAvailableUsersWithDistance(userType, currentUserId)
        : useAvailableUsers(userType, currentUserId);

    // Transform users to create appropriate cards for display
    const transformUsersForDisplay = (users: User[]): User[] => {
        const displayUsers: User[] = [];

        users.forEach(user => {
            // Check if this user has family members with care preferences
            if (user.familyMembers && user.familyMembers.length > 0) {
                // Create a separate card for each family member
                user.familyMembers.forEach(familyMember => {
                    // Create a modified user object for family member card
                    const familyMemberUser: User = {
                        ...user,
                        // Create unique ID for this family member card
                        id: `${user.id}-family-${familyMember.id}`,
                        // Mark this as family member data for UserCardSeeker
                        isFamilyMemberCard: true,
                        familyMemberInfo: familyMember
                    };

                    displayUsers.push(familyMemberUser);
                });
            } else if (user.carePreferences) {
                // This is a PSW or self-care seeker with user-level care preferences
                displayUsers.push(user);
            }
        });

        return displayUsers;
    };

    const transformedUsers = usersQuery.data ? transformUsersForDisplay(usersQuery.data) : [];

    return {
        users: transformedUsers,
        isLoading: usersQuery.isLoading,
        error: usersQuery.error,
        refetch: usersQuery.refetch
    };
};
