import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { MenuState, PageItem } from "../interfaces";

export const rowDefault: PageItem = {
  _id: "",
  nombre: "",
  icono: "",
  orden: 1,
  delete: [],
  update: [],
  insert: [],
  select: [],
  createdAt: "",
  updatedAt: "",
};
const initialState: MenuState = {
  openModal: false,
  rows: [],
  rowActive: rowDefault,
};
export const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    getSliceDataMenu: (state, action: PayloadAction<PageItem[]>) => {
      state.rows = action.payload;
    },
    onCloseSliceModalMenu: (state) => {
      state.openModal = false;
    },
    onOpenSliceModalMenu: (state) => {
      state.openModal = true;
    },
  },
});

// Action creators are generated for each case reducer function
export const { getSliceDataMenu, onCloseSliceModalMenu, onOpenSliceModalMenu } =
  menuSlice.actions;
