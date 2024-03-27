import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { MenuState, PageItem } from "../";

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
  rowDefault,
};

export const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    getSliceDataMenu: (state, action: PayloadAction<PageItem[]>) => {
      state.rows = action.payload;
    },
    setSliceOpenModalMenu: (state, action: PayloadAction<boolean>) => {
      state.openModal = action.payload;
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
  onSliceEditMenu,
  setSliceActiveRow,
  setSliceOpenModalMenu,
} = menuSlice.actions;
