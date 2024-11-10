import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import searchHistoryReducer from "./searchHistorySlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    searchHistory: searchHistoryReducer,
  },
});

export default store;
