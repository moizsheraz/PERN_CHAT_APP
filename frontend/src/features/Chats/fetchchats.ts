import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface Chat {
  id: string;
  fullName: string;
  profilePic: string;
}

export interface SideBarChatsState {
  chats: Chat[];
  isLoading: boolean;
  error: string | null;
}

const initialState: SideBarChatsState = {
  chats: [],
  isLoading: false,
  error: null,
};

export const getChats:any = createAsyncThunk(
  'chats/getChats',
  async () => {
    const axiosOptions = {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await axios.get("http://localhost:3000/api/messages/conversations", axiosOptions);
      return response.data; // This should be the data you want to store in the state
    } catch (error) {
      throw error; // This will be handled by the rejected case
    }
  }
);

const SideChats = createSlice({
  name: 'sidebarChats',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getChats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getChats.fulfilled, (state, action: PayloadAction<Chat[]>) => {
        state.chats = action.payload;
        state.isLoading = false;
      })
      .addCase(getChats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch chats';
      });
  },
});

export const { clearError } = SideChats.actions;
export default SideChats.reducer;
