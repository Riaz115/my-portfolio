import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isLoading: boolean;
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
}

const initialState: UIState = {
  isLoading: false,
  isSidebarOpen: true,
  isMobileMenuOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    toggleSidebar(state, action: PayloadAction<boolean>) {
      state.isSidebarOpen = action.payload;
    },
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    closeMobileMenu: (state) => {
      state.isMobileMenuOpen = false;
    },
  },
});

export const { setLoading, toggleSidebar, toggleMobileMenu, closeMobileMenu } = uiSlice.actions;
export default uiSlice.reducer;