import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { PageState, PageItem, itemDefault } from "../";

const initialState: PageState = {
  openModal: false,
  itemActive: itemDefault,
  itemDefault,
  data: [],
  count: 0,
  cargando: true,
};

export const pageSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    getSliceDataPage: (state, action: PayloadAction<PageItem[]>) => {
      state.data = action.payload;
      state.cargando = false;
    },
    setSliceOpenModalPage: (state, action: PayloadAction<boolean>) => {
      state.openModal = action.payload;
    },
    setSliceItemActive: (state, action: PayloadAction<PageItem>) => {
      state.itemActive = action.payload;
    },
    onSliceAgregarPage: (state, action: PayloadAction<PageItem>) => {
      state.data.unshift({
        ...action.payload,
        crud: {
          nuevo: true,
        },
      });
    },
    onSliceEditPage: (state, action: PayloadAction<PageItem>) => {
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
  getSliceDataPage,
  onSliceAgregarPage,
  onSliceEditPage,
  setSliceItemActive,
  setSliceOpenModalPage,
} = pageSlice.actions;
