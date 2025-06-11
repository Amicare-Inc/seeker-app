
export const updateUserProfile = async (userId: string, updatedFields: any) => {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/users/update-profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: userId,
        ...updatedFields,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const fetchFilteredUsers = async (selectedDays: string[]) => {
  try {
    const daysQuery = selectedDays.join(',');
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/users/filter-availability?days=${daysQuery}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const users = await response.json();
    return users;
  } catch (error: any) {
    console.error('Error fetching filtered users:', error);
    throw error;
  }
};