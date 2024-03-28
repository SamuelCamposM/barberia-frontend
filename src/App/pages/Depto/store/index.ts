import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DeptoItem, DeptoState } from "../interfaces";

const rowDefault: DeptoItem = {
  name: "",
};

const initialState: DeptoState = {
  cargando: true,
  openRow: false,
  rowDefault: rowDefault,
  rows: [],
};
export const deptoSlice = createSlice({
  name: "depto",
  initialState,
  reducers: {
    getSliceDataDepto: (state, action: PayloadAction<DeptoItem[]>) => {
      state.rows = action.payload;
    },
  },
});
export const { getSliceDataDepto } = deptoSlice.actions;
