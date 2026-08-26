import { createSlice } from '@reduxjs/toolkit';

const initialFilters = {
  pinCode: '',
  locality: '',
  city: '',
  dateRange: '',
  status: '',
  page: 1,
  limit: 14,
};

const filterSlice = createSlice({
  name: 'filter',
  initialState: {
    filters: initialFilters,
  },
  reducers: {
    setFilters: (state, action) => {
      if (typeof action.payload === 'function') {
        state.filters = action.payload(state.filters);
      } else {
        state.filters = {
          ...state.filters,
          ...action.payload,
        };
      }
    },
    resetFilters: (state) => {
      state.filters = initialFilters;
    },
  },
});

export const { setFilters, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;
