import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getListOfUsers } from '@/services/firebase/firestore';
import { User } from '@/types/User';
import { RootState } from './store';

interface FetchUsersArgs {
  isPsw: boolean;
}

export const fetchAvailableUsers = createAsyncThunk(
  "usersList/fetchAvailableUsers",
  async ({ isPsw }: FetchUsersArgs, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const currentUserId = state.user.userData?.id;
    const sessions = state.sessions.allSessions;

    if (!currentUserId) {
      return rejectWithValue("No current user found");
    }

    try {
      const availableUsers = await getListOfUsers(isPsw, currentUserId, sessions);
      return availableUsers as User[];
    } catch (error) {
      return rejectWithValue((error as any).message);
    }
  }
);

const usersListSlice = createSlice({
  name: 'usersList',
  initialState: {
    users: [] as User[],
    loading: false,
    error: null as string | null,
  },
  reducers: {
    clearUsers: (state) => {
      state.users = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAvailableUsers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAvailableUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload;
    });
    builder.addCase(fetchAvailableUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearUsers } = usersListSlice.actions;
export default usersListSlice.reducer;