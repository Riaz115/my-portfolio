import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Get initial state from localStorage if available
const getInitialState = (): AuthState => {
  return {
    user: null,
    token: null,
    isAuthenticated: false,
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      console.log('🔄 Setting credentials in Redux:', action.payload);
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('portfolio_auth', JSON.stringify(action.payload));
        console.log('💾 Saved to localStorage:', action.payload);
      }
    },
    logout: (state) => {
      console.log('🚪 Logging out user');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      // Remove from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('portfolio_auth');
        console.log('🗑️ Removed from localStorage');
      }
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        // Update localStorage with new user data
        if (state.token && typeof window !== 'undefined') {
          localStorage.setItem('portfolio_auth', JSON.stringify({ user: state.user, token: state.token }));
        }
      }
    },
  },
});

export const { setCredentials, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;