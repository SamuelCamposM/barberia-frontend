import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Usuario, AuthState } from "../interfaces";

const initialState: AuthState = {
  status: "checking",
  usuario: {
    name: "",
    email: "",
    online: false,
    uid: "",
    estado: true,
    lastname: "",
    rol: "GERENTE",
    tel: "",
    createdAt: "",
    updatedAt: "",
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
    onSliceLogin: (state, action: PayloadAction<Usuario>) => {
      //   {
      //     "": true,
      //     "": "Samuel Benjamin",
      //     "": "s.cmelara12@gmail.com",
      //     "": true,
      //     "": "CLIENTE",
      //     "": "Campos",
      //     "": "+50376681782",
      //     "": "65f9f915df006187fc65b648"
      // }
      state.status = "authenticated";
      state.usuario = action.payload;
      state.errorMessage = undefined;
    },
    onSliceLogout: (state, action: PayloadAction<string | undefined>) => {
      state.status = "not-authenticated";
      state.usuario = initialState.usuario; // You might want to replace this with a proper initial value
      state.errorMessage = action.payload;
    },
    clearErrorMessage: (state) => {
      state.errorMessage = undefined;
    },
    onSliceEditUsuario: (state, action: PayloadAction<Usuario>) => {
      state.usuario = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  onSlicechecking,
  onSliceLogin,
  onSliceLogout,
  clearErrorMessage,
  onSliceEditUsuario,
} = authSlice.actions;
