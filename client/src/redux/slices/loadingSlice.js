import { createSlice } from '@reduxjs/toolkit';

const loadingSlice = createSlice({
  name: 'loading',
  initialState: {
    globalLoading: false,
  },
  reducers: {
    showLoading: (state) => {
      state.globalLoading = true;
    },
    hideLoading: (state) => {
      state.globalLoading = false;
    },
    setGlobalLoading: (state, action) => {
      state.globalLoading = Boolean(action.payload);
    },
  },
});

export const { showLoading, hideLoading, setGlobalLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
