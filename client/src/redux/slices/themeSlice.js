import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  try {
    const savedTheme = localStorage.getItem('UrbanResolveTheme');
    if (savedTheme && savedTheme !== 'undefined' && (savedTheme === 'light' || savedTheme === 'dark')) {
      return savedTheme;
    }
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
  } catch {
    // fallback
  }
  return 'light';
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: getInitialTheme(),
  },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      localStorage.setItem('UrbanResolveTheme', state.mode);
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
      localStorage.setItem('UrbanResolveTheme', action.payload);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
