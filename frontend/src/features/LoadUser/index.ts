import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface LoadUserState {
  isAuthenticated: boolean
  userInfo: {
    id: string
    fullName: string
    username: string
    profilePic: string
  } | null
  loading: boolean
  error: string | null
}

const initialState: LoadUserState = {
  isAuthenticated: false,
  userInfo: null,
  loading: false,
  error: null,
}


export const getMe:any = createAsyncThunk(
  'user/getMe',
  async (_, { rejectWithValue }) => {
    const axiosOptions = {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await axios.get('http://localhost:3000/api/auth/me',axiosOptions)
      return response.data
    } catch (error:any) {
      return rejectWithValue(error.response.data)
    }
  }
)

const LoadUserSlice = createSlice({
  name: 'User',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMe.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getMe.fulfilled, (state, action: PayloadAction<LoadUserState['userInfo']>) => {
        state.loading = false
        state.isAuthenticated = true
        state.userInfo = action.payload
      })
      .addCase(getMe.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError } = LoadUserSlice.actions
export default LoadUserSlice.reducer
