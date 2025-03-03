import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getListOfUsers } from '@/services/firebase/firestore';
import { User } from '@/types/User';

export const fetchUsers = createAsyncThunk(
  'usersList/fetchUsers',
  async (isPsw: boolean, { rejectWithValue }) => {
    try {
      const users = await getListOfUsers(isPsw);
      return users as User[];
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
    builder.addCase(fetchUsers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload;
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearUsers } = usersListSlice.actions;
export default usersListSlice.reducer;