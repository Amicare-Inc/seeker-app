import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message } from '@/types/Message';
import { getMessages } from '@/features/sessions/api/sessionApi';

export const fetchMessagesBySessionId = createAsyncThunk<
  Message[], // Expected return type
  string, // Argument type (sessionId)
  { rejectValue: string } // Optional: type for rejectValue
>(
  'chat/fetchMessagesBySessionId',
  async (sessionId: string, { rejectWithValue }) => {
    try {
      // TODO: Import getMessagesBySessionId from your frontend service
      const messages = await getMessages(sessionId); 
      return messages;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch messages');
    }
  }
);

interface ChatState {
  messages: Message[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  messages: [],
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessages(state, action: PayloadAction<Message[]>) {
      state.messages = action.payload;
      state.loading = false;
      state.error = null;
    },
    addMessage(state, action: PayloadAction<Message>) {
      state.messages.push(action.payload);
    },
    clearMessages(state) {
      state.messages = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessagesBySessionId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessagesBySessionId.fulfilled, (state, action) => {
        state.messages = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchMessagesBySessionId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string
      });
  },
});

export const { setMessages, addMessage, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;
