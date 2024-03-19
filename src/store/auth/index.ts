import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { User, AuthState } from "../interfaces";

const initialState: AuthState = {
  status: "checking",
  user: {
    name: "",
    email: "",
    online: false,
    uid: "",
    estado: true,
    lastname: "",
    rol: "GERENTE",
    tel: "",
  }, // You might want to replace this with a proper initial value
  errorMessage: undefined,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    onSlicechecking: (state /* action */) => {
      state.status = "checking";
      state.errorMessage = undefined;
    },
    onSliceLogin: (state, action: PayloadAction<User>) => {
      state.status = "authenticated";
      state.user = action.payload;
      state.errorMessage = undefined;
    },
    onSliceLogout: (state, action: PayloadAction<string | undefined>) => {
      state.status = "not-authenticated";
      state.user = initialState.user; // You might want to replace this with a proper initial value
      state.errorMessage = action.payload;
    },
    clearErrorMessage: (state) => {
      state.errorMessage = undefined;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  onSlicechecking,
  onSliceLogin,
  onSliceLogout,
  clearErrorMessage,
} = authSlice.actions;
