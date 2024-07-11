import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { io } from 'socket.io-client';

export interface Message {
    id: string;
    body: string;
    createdAt: string; 
    shouldShake?: boolean;
}

export interface currentChatMessages {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  isSelected: boolean;
}

const initialState: currentChatMessages = {
  messages: [],
  isLoading: false,
  error: null,
  isSelected: false
};

export const getMessages:any= createAsyncThunk(
  'chats/getMessages',
  async (id: string) => {
    const axiosOptions = {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await axios.get(`http://localhost:3000/api/messages/${id}`, axiosOptions);
      return response.data; // This should be the data you want to store in the state
    } catch (error) {
      throw error; // This will be handled by the rejected case
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
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMessages.fulfilled, (state, action: PayloadAction<Message[]>) => {
        state.messages = action.payload;
        state.isLoading = false;
        state.isSelected = true;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch chats';
      });
  },
});

export const { clearError, addMessage } = currentChatMessagesSlice.actions;
export default currentChatMessagesSlice.reducer;
