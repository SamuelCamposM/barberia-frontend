import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ProductoItem, ProductoState } from "../interfaces";
import { itemDefault } from "../helpers";
import { handleSliceChangeComponent } from "../../Menu";

const initialState: ProductoState = {
  openModal: false,
  itemActive: itemDefault,
  itemDefault,
};

export const productoSlice = createSlice({
  name: "producto",
  initialState,
  reducers: {
    setSliceOpenModal: (state, action: PayloadAction<boolean>) => {
      state.openModal = action.payload;
    },
    setSliceItemActive: (state, action: PayloadAction<ProductoItem>) => {
      state.itemActive = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(handleSliceChangeComponent, () => {
      return initialState;
    });
  },
});

// Action creators are generated for each case reducer function
export const { setSliceItemActive, setSliceOpenModal } = productoSlice.actions;
