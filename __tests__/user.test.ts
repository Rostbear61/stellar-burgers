import { userReducer, initialState, resetError, resetPasswordResetState } from '../src/services/slices/user';
import {
  fetchUser,
  checkUserAuth,
  login,
  register,
  updateProfile,
  logout,
  forgotPassword,
  resetPassword,
  getUser,
  getIsAuthChecked
} from '../src/services/slices/user';
import { TUser } from '@utils-types';
import { RootState } from '../src/services/store';

describe('userSlice', () => {
  const mockUser: TUser = {
    email: 'test@example.com',
    name: 'Test User'
  };

  describe('reducers', () => {
    it('should handle initial state', () => {
      expect(userReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle resetError', () => {
      const stateWithError = { ...initialState, error: 'Some error' };
      expect(userReducer(stateWithError, resetError())).toEqual({
        ...stateWithError,
        error: null
      });
    });

    it('should handle resetPasswordResetState', () => {
      const stateWithReset = {
        ...initialState,
        passwordResetRequest: true,
        passwordResetSuccess: true
      };
      expect(userReducer(stateWithReset, resetPasswordResetState())).toEqual({
        ...stateWithReset,
        passwordResetRequest: false,
        passwordResetSuccess: false
      });
    });
  });

  describe('extraReducers', () => {
    it('should handle checkUserAuth.pending', () => {
      const action = { type: checkUserAuth.pending.type };
      const state = userReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: true
      });
    });

    it('should handle checkUserAuth.fulfilled', () => {
      const action = { type: checkUserAuth.fulfilled.type, payload: mockUser };
      const state = userReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        user: mockUser,
        isAuthChecked: true,
        loading: false
      });
    });

    it('should handle checkUserAuth.rejected', () => {
      const error = 'Auth failed';
      const action = {
        type: checkUserAuth.rejected.type,
        payload: error
      };
      const state = userReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        isAuthChecked: true,
        loading: false,
        error: error
      });
    });

    it('should handle fetchUser.pending', () => {
      const action = { type: fetchUser.pending.type };
      const state = userReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null
      });
    });

    it('should handle fetchUser.fulfilled', () => {
      const action = { type: fetchUser.fulfilled.type, payload: mockUser };
      const state = userReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        user: mockUser,
        loading: false,
        isAuthChecked: true
      });
    });

    it('should handle fetchUser.rejected', () => {
      const error = 'Fetch failed';
      const action = { type: fetchUser.rejected.type, payload: error };
      const state = userReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: false,
        user: null,
        isAuthChecked: true,
        error: error
      });
    });

    it('should handle login.pending', () => {
      const action = { type: login.pending.type };
      const state = userReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null
      });
    });

    it('should handle login.fulfilled', () => {
      const action = { type: login.fulfilled.type, payload: mockUser };
      const state = userReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        user: mockUser,
        loading: false
      });
    });

    it('should handle login.rejected', () => {
      const error = 'Login failed';
      const action = { type: login.rejected.type, payload: error };
      const state = userReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: error
      });
    });

    it('should handle register.pending', () => {
      const action = { type: register.pending.type };
      const state = userReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null
      });
    });

    it('should handle register.fulfilled', () => {
      const action = { type: register.fulfilled.type, payload: mockUser };
      const state = userReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        user: mockUser,
        loading: false
      });
    });

    it('should handle register.rejected', () => {
      const error = 'Registration failed';
      const action = { type: register.rejected.type, payload: error };
      const state = userReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: error
      });
    });

    it('should handle updateProfile.pending', () => {
      const action = { type: updateProfile.pending.type };
      const state = userReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null
      });
    });

    it('should handle updateProfile.fulfilled', () => {
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      const action = { type: updateProfile.fulfilled.type, payload: updatedUser };
      const state = userReducer({ ...initialState, user: mockUser }, action);
      expect(state).toEqual({
        ...initialState,
        user: updatedUser,
        loading: false
      });
    });

    it('should handle updateProfile.rejected', () => {
      const error = 'Update failed';
      const action = { type: updateProfile.rejected.type, payload: error };
      const state = userReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: error
      });
    });

    it('should handle logout.pending', () => {
      const action = { type: logout.pending.type };
      const state = userReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null
      });
    });

    it('should handle logout.fulfilled', () => {
      const action = { type: logout.fulfilled.type };
      const state = userReducer({ ...initialState, user: mockUser }, action);
      expect(state).toEqual({
        ...initialState,
        user: null,
        loading: false
      });
    });

    it('should handle logout.rejected', () => {
      const error = 'Logout failed';
      const action = { type: logout.rejected.type, payload: error };
      const state = userReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: error
      });
    });

    it('should handle forgotPassword.pending', () => {
      const action = { type: forgotPassword.pending.type };
      const state = userReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null
      });
    });

    it('should handle forgotPassword.fulfilled', () => {
      const action = { type: forgotPassword.fulfilled.type };
      const state = userReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: false,
        passwordResetRequest: true
      });
    });

    it('should handle forgotPassword.rejected', () => {
      const error = 'Password reset failed';
      const action = { type: forgotPassword.rejected.type, payload: error };
      const state = userReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: error
      });
    });

    it('should handle resetPassword.pending', () => {
      const action = { type: resetPassword.pending.type };
      const state = userReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null
      });
    });

    it('should handle resetPassword.fulfilled', () => {
      const action = { type: resetPassword.fulfilled.type };
      const state = userReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: false,
        passwordResetSuccess: true
      });
    });

    it('should handle resetPassword.rejected', () => {
      const error = 'Reset failed';
      const action = { type: resetPassword.rejected.type, payload: error };
      const state = userReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: error
      });
    });
  });

  describe('selectors', () => {
    const mockState = {
      user: {
        user: mockUser,
        isAuthChecked: true,
        error: null,
        loading: false,
        passwordResetRequest: false,
        passwordResetSuccess: false
      }
    };

    it('should select user', () => {
      expect(getUser(mockState as RootState)).toEqual(mockUser);
    });

    it('should select isAuthChecked', () => {
      expect(getIsAuthChecked(mockState as RootState)).toBe(true);
    });
  });
});