import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { MenuState, PageItem } from "../../../../store/interfaces";

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
  componente: "",
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
    onSliceEditMenu: (state, action: PayloadAction<PageItem>) => {
      state.rows = state.rows.map((row) =>
        row._id === action.payload._id
          ? { crud: { editado: true }, ...action.payload }
          : row
      );
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  getSliceDataMenu,
  onCloseSliceModalMenu,
  onOpenSliceModalMenu,
  onSliceEditMenu,
  setSliceActiveRow,
} = menuSlice.actions;
