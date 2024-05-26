import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CompraItem, CompraState } from "../interfaces";
import { itemDefault } from "../helpers";

const initialState: CompraState = {
  openModal: false,
  itemActive: itemDefault,
  itemDefault,
};

export const compraSlice = createSlice({
  name: "compra",
  initialState,
  reducers: {
    setSliceOpenModal: (state, action: PayloadAction<boolean>) => {
      state.openModal = action.payload;
    },
    setSliceItemActive: (state, action: PayloadAction<CompraItem>) => {
      state.itemActive = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setSliceItemActive, setSliceOpenModal } = compraSlice.actions;
