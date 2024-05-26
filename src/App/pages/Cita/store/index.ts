import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CitaItem, CitaState } from "../interfaces";
import { itemDefault } from "../helpers";
const initialState: CitaState = {
  openModal: false,
  itemActive: itemDefault,
  itemDefault,
};

export const citaSlice = createSlice({
  name: "cita",
  initialState,
  reducers: {
    setSliceOpenModal: (state, action: PayloadAction<boolean>) => {
      state.openModal = action.payload;
    },
    setSliceItemActive: (state, action: PayloadAction<CitaItem>) => {
      state.itemActive = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setSliceItemActive, setSliceOpenModal } = citaSlice.actions;
