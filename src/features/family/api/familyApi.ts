// Family API service
export const FamilyApi = {
  async addFamilyMember(userId: string, familyMemberData: any): Promise<any> {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/family/${userId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(familyMemberData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add family member');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Backend addFamilyMember Error:', error);
      throw new Error(`Failed to add family member: ${error.message}`);
    }
  },

  async updateFamilyMember(userId: string, memberId: string, updateData: any): Promise<any> {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/family/${userId}/members/${memberId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update family member');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Backend updateFamilyMember Error:', error);
      throw new Error(`Failed to update family member: ${error.message}`);
    }
  },

  async deleteFamilyMember(userId: string, memberId: string): Promise<void> {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/family/${userId}/members/${memberId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete family member');
      }
    } catch (error: any) {
      console.error('Backend deleteFamilyMember Error:', error);
      throw new Error(`Failed to delete family member: ${error.message}`);
    }
  },

  async getFamilyMembers(userId: string): Promise<any> {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/family/${userId}/members`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get family members');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Backend getFamilyMembers Error:', error);
      throw new Error(`Failed to get family members: ${error.message}`);
    }
  },

  async getFamilyMember(userId: string, memberId: string): Promise<any> {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/family/${userId}/members/${memberId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get family member');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Backend getFamilyMember Error:', error);
      throw new Error(`Failed to get family member: ${error.message}`);
    }
  },
}; 