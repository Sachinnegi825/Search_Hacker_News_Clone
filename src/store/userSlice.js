import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    username: localStorage.getItem("username") || "",
  },
  reducers: {
    setUser: (state, action) => {
      state.username = action.payload;
      localStorage.setItem("username", action.payload);
    },
    logoutUser: (state) => {
      state.username = "";
      localStorage.removeItem("username");
    },
  },
});

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
