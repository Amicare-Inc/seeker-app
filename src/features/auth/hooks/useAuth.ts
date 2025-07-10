import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchUserFromLoginThunk, clearUser } from '@/redux/userSlice';
import { FIREBASE_AUTH } from '@/firebase.config';
import { router } from 'expo-router';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userData, loading, error } = useSelector((state: RootState) => state.user);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await dispatch(fetchUserFromLoginThunk({ email, password }));
      return result;
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await FIREBASE_AUTH.signOut();
      dispatch(clearUser());
      router.replace('/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return {
    user: userData,
    loading,
    error,
    signIn,
    signOut,
    isAuthenticated: !!userData,
  };
}; 