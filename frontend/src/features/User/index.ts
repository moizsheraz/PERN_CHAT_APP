import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface UserState {
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

const initialState: UserState = {
  isAuthenticated: false,
  userInfo: null,
  loading: false,
  error: null,
}

// Async thunks for signup, login, and logout
export const signupUser : any = createAsyncThunk(
  'user/signup',
  async (userData: { fullName: string, username: string, password: string, confirmPassword: string, gender: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/signup', userData)
      return response.data
    } catch (error:any) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const loginUser: any = createAsyncThunk(
  'user/login',
  async (userData: { username: string, password: string }, { rejectWithValue }) => {
    const axiosOptions = {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', userData, axiosOptions);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const logoutUser:any = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    const axiosOptions = {
      withCredentials: true,
    };
    try {
      const response = await axios.post('http://localhost:3000/api/auth/logout', axiosOptions)
      return response.data
    } catch (error:any) {
      return rejectWithValue(error.response.data)
    }
  }
)

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

const UserSlice = createSlice({
  name: 'User',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signupUser.fulfilled, (state, action: PayloadAction<UserState['userInfo']>) => {
        state.loading = false
        state.isAuthenticated = true
        state.userInfo = action.payload
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<UserState['userInfo']>) => {
        state.loading = false
        state.isAuthenticated = true
        state.userInfo = action.payload
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false
        state.isAuthenticated = false
        state.userInfo = null
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(getMe.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getMe.fulfilled, (state, action: PayloadAction<UserState['userInfo']>) => {
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

export const { clearError } = UserSlice.actions
export default UserSlice.reducer
