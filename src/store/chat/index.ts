import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ChatState, Mensaje, Usuario } from "../interfaces";
import { onSliceLogout } from "../auth";

const initialState: ChatState = {
  chatActivo: null,
  mensajes: [],
  uid: "",
  usuarios: [],
};
export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    onSliceCargarUsuarios: (state, action: PayloadAction<Usuario[]>) => {
      state.usuarios = action.payload;
    },
    onSliceSelectChat: (state, action: PayloadAction<string>) => {
      if (state.chatActivo === action.payload) {
        return;
      }
      state.chatActivo = action.payload;
      state.mensajes = [];
    },
    onSliceAddMessage: (state, action: PayloadAction<Mensaje>) => {
      if (
        state.chatActivo === action.payload.de ||
        state.chatActivo === action.payload.para
      ) {
        state.mensajes = [...state.mensajes, action.payload];
      }
    },
    onSliceGetMensajes: (state, action: PayloadAction<Mensaje[]>) => {
      state.mensajes = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(onSliceLogout, () => initialState);
  },
});

// Action creators are generated for each case reducer function
export const {
  onSliceCargarUsuarios,
  onSliceSelectChat,
  onSliceAddMessage,
  onSliceGetMensajes,
} = chatSlice.actions;
