import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { MenuState, PageItem } from "../";

const itemDefault: PageItem = {
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
  itemActive: itemDefault,
  itemDefault,
  data: [],
};

export const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    getSliceDataMenu: (state, action: PayloadAction<PageItem[]>) => {
      state.data = action.payload;
    },
    setSliceOpenModalMenu: (state, action: PayloadAction<boolean>) => {
      state.openModal = action.payload;
    },
    setSliceItemActive: (state, action: PayloadAction<PageItem>) => {
      state.itemActive = action.payload;
    },
    onSliceEditMenu: (state, action: PayloadAction<PageItem>) => {
      state.data = state.data.map((row) =>
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
  setSliceItemActive,
  setSliceOpenModalMenu,
} = menuSlice.actions;
