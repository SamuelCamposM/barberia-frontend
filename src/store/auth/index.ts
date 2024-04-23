import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, Usuario } from "../interfaces";

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
  }, // Initialize with the default values
  errorMessage: undefined,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    onSlicechecking: (state) => {
      state.status = "checking";
      state.usuario = initialState.usuario; // Reset to the default values
      state.errorMessage = undefined;
    },
    onSliceLogin: (state, action: PayloadAction<Usuario>) => {
      state.status = "authenticated";
      state.usuario = action.payload;
      state.errorMessage = undefined;
    },
    onSliceLogout: (state, action: PayloadAction<string | undefined>) => {
      state.status = "not-authenticated";
      state.usuario = initialState.usuario; // Reset to the default values
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
