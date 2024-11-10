import { createSlice } from "@reduxjs/toolkit";

const searchHistorySlice = createSlice({
  name: "searchHistory",
  initialState: [],
  reducers: {
    addSearchHistory: (state, action) => {
      const newSearch = { data: action.payload };
      state.push(newSearch);
    },
    clearSearchHistory: () => {
      return [];
    },
  },
});

export const { addSearchHistory, clearSearchHistory } =
  searchHistorySlice.actions;
export default searchHistorySlice.reducer;
