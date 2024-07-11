import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface Message {
  id: string;
  text: string;
  // Add other fields as necessary
}

export interface currentChatMessages {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

const initialState: currentChatMessages = {
  messages: [],
  isLoading: false,
  error: null,
};

interface SendMessagePayload {
  id: string;
  message: string;
}

export const sendMessage:any = createAsyncThunk(
  'chats/sendMessage',
  async ({ id, message }: SendMessagePayload) => {
    const axiosOptions = {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await axios.post(`http://localhost:3000/api/messages/send/${id}`, { message }, axiosOptions);
      return response.data; 
    } catch (error) {
      throw error;
    }
  }
);

const currentChatMessagesSlice = createSlice({
  name: 'currentChatMessages',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action: PayloadAction<Message[]>) => {
        state.messages = action.payload;
        state.isLoading = false;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to send message';
      });
  },
});

export const { clearError } = currentChatMessagesSlice.actions;
export default currentChatMessagesSlice.reducer;
