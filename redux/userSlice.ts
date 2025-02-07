// redux/userSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getUserDoc } from '@/services/firebase/firestore'; // your Firestore function
import { User } from '@/types/User';

// 1) Define a thunk for fetching a user's Firestore doc by UID
export const fetchUserById = createAsyncThunk(
  'user/fetchUserById',
  async (uid: string) => {
    // call your existing getUserDoc(uid)
    const userDoc = await getUserDoc(uid);
    if (!userDoc) {
      throw new Error('User doc not found in Firestore');
    }
    // Return the Firestore data, plus the UID
    return { ...userDoc, id: uid } as User;
  }
);

interface UserState {
  userData: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  userData: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Optionally define standard reducers, e.g. to clear user data
    clearUser(state) {
      state.userData = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchUserById pending
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // fetchUserById fulfilled
      .addCase(fetchUserById.fulfilled, (state, action: PayloadAction<User>) => {
        state.userData = action.payload;
        state.loading = false;
      })
      // fetchUserById rejected
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error fetching user';
      });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;