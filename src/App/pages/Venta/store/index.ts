import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { VentaItem, VentaState } from "../interfaces";
import { itemDefault } from "../helpers";

const initialState: VentaState = {
  openModal: false,
  itemActive: itemDefault,
  itemDefault,
};

export const ventaSlice = createSlice({
  name: "venta",
  initialState,
  reducers: {
    setSliceOpenModal: (state, action: PayloadAction<boolean>) => {
      state.openModal = action.payload;
    },
    setSliceItemActive: (state, action: PayloadAction<VentaItem>) => {
      state.itemActive = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setSliceItemActive, setSliceOpenModal } = ventaSlice.actions;
