import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  user: {},
  refresh: "",
  access: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      Object.assign(state, action.payload);
    },
    setUserTokens: (state, action) => {
      state.access = action.payload;
    },
    resetUserData: (state) => {
      Object.assign(state, initialState);
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setUserData,
  setUserTokens,
  resetUserData,
} = userSlice.actions;

export default userSlice.reducer;
