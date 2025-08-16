import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  getUserApi,
  loginUserApi,
  registerUserApi,
  logoutApi,
  updateUserApi,
  forgotPasswordApi,
  resetPasswordApi
} from '../../utils/burger-api';
import { RootState } from '../store';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';
import { TRegisterData, TLoginData } from '../../utils/burger-api';

export interface UserState {
  user: TUser | null;
  isAuthChecked: boolean;
  error?: string | null;
  loading: boolean;
  passwordResetRequest: boolean;
  passwordResetSuccess: boolean;
}

export const initialState: UserState = {
  user: null,
  isAuthChecked: false,
  error: null,
  loading: false,
  passwordResetRequest: false,
  passwordResetSuccess: false
};
export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getUserApi();
      return data.user;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch user'
      );
    }
  }
);

export const checkUserAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      if (!getCookie('accessToken')) {
        return null;
      }
      const data = await getUserApi();
      return data.user;
    } catch (error) {
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      return rejectWithValue(
        error instanceof Error ? error.message : 'Auth check failed'
      );
    }
  }
);

export const login = createAsyncThunk(
  'user/login',
  async (credentials: TLoginData, { rejectWithValue }) => {
    try {
      const data = await loginUserApi(credentials);
      setCookie('accessToken', data.accessToken.split('Bearer ')[1], {
        maxAge: 1200
      });
      localStorage.setItem('refreshToken', data.refreshToken);
      return data.user;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Login failed'
      );
    }
  }
);

export const register = createAsyncThunk(
  'user/register',
  async (userData: TRegisterData, { rejectWithValue }) => {
    try {
      const data = await registerUserApi(userData);
      setCookie('accessToken', data.accessToken.split('Bearer ')[1]);
      localStorage.setItem('refreshToken', data.refreshToken);
      return data.user;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Registration failed'
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (userData: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const data = await updateUserApi(userData);
      return data.user;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Profile update failed'
      );
    }
  }
);

export const logout = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      return null;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Logout failed'
      );
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      await forgotPasswordApi({ email });
      return true;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Password reset request failed'
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async (
    { password, token }: { password: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      await resetPasswordApi({ password, token });
      return true;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Password reset failed'
      );
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetError(state) {
      state.error = null;
    },
    resetPasswordResetState: (state) => {
      state.passwordResetRequest = false;
      state.passwordResetSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Check auth status
      .addCase(checkUserAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.loading = false;
      })
      .addCase(checkUserAuth.rejected, (state, action) => {
        state.isAuthChecked = true;
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch user
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.user = action.payload;
        state.loading = false;
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthChecked = true;
        state.error = action.payload as string;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateProfile.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          state.user = action.payload;
          state.loading = false;
        }
      )
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Forgot password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.passwordResetRequest = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Reset password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.passwordResetSuccess = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const userReducer = userSlice.reducer;
export const getUser = (state: RootState): TUser | null =>
  state.user?.user ?? null;
export const getIsAuthChecked = (state: RootState): boolean =>
  state.user.isAuthChecked;
export const { resetError, resetPasswordResetState } = userSlice.actions;
