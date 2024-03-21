import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { MenuState, PageItem } from "../interfaces";

export const rowDefault: PageItem = {
  _id: "",
  nombre: "",
  icono: "",
  delete: [],
  update: [],
  insert: [],
  select: [],
  ver: [],
  createdAt: "",
  updatedAt: "",
  orden: 0,
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
    setSliceActiveRow: (state, action: PayloadAction<PageItem>) => {
      state.rowActive = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  getSliceDataMenu,
  onCloseSliceModalMenu,
  onOpenSliceModalMenu,
  setSliceActiveRow,
} = menuSlice.actions;
