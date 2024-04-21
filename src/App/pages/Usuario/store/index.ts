import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UsuarioItem, UsuarioState } from "../interfaces";
import { itemDefault } from "../helpers";
import { handleSliceChangeComponent } from "../../Menu";

const initialState: UsuarioState = {
  openModal: false,
  itemActive: itemDefault,
  itemDefault,
};

export const usuarioSlice = createSlice({
  name: "usuario",
  initialState,
  reducers: {
    setSliceOpenModal: (state, action: PayloadAction<boolean>) => {
      state.openModal = action.payload;
    },
    setSliceItemActive: (state, action: PayloadAction<UsuarioItem>) => {
      state.itemActive = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(handleSliceChangeComponent, () => {
      return initialState;
    });
  },
});

// Action creators are generated for each case reducer function
export const { setSliceItemActive, setSliceOpenModal } = usuarioSlice.actions;
