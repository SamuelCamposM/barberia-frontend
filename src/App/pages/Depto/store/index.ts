import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DeptoItem, DeptoState } from "../interfaces";
import { Pagination } from "../../../../interfaces/global";
import { paginationDefault } from "../../../../helpers";

const rowDefault: DeptoItem = {
  name: "",
};

const initialState: DeptoState = {
  cargando: true,
  agregando: false,
  rowDefault: rowDefault,
  data: [],
  isSearching: false,
  pagination: paginationDefault,
};
export const deptoSlice = createSlice({
  name: "depto",
  initialState,
  reducers: {
    getSliceDataDepto: (
      state,
      action: PayloadAction<{
        docs: DeptoItem[];
        paginationResult: Pagination;
      }>
    ) => {
      state.data = action.payload.docs;
      state.pagination = action.payload.paginationResult;
    },
    onSliceEditDepto: (state, action: PayloadAction<DeptoItem>) => {
      state.data = state.data.map((item) =>
        item._id === action.payload._id
          ? { crud: { editado: true }, ...action.payload }
          : item
      );
    },
    onSliceAgregarDepto: (state, action: PayloadAction<DeptoItem>) => {
      state.data.unshift({
        ...action.payload,
        totalMunicipios: 0,
        crud: {
          nuevo: true,
        },
      });
      state.pagination = {
        ...state.pagination,
        totalDocs: state.pagination.totalDocs + 1,
      };
    },
    onSliceEliminarDepto: (state, action: PayloadAction<string>) => {
      state.data = state.data.map((item) =>
        item._id === action.payload
          ? { crud: { eliminado: true }, ...item }
          : item
      );
    },
    setSliceAgregando: (state, action: PayloadAction<boolean>) => {
      state.agregando = action.payload;
    },
  },
});
export const {
  getSliceDataDepto,
  onSliceAgregarDepto,
  onSliceEditDepto,
  setSliceAgregando,
  onSliceEliminarDepto,
} = deptoSlice.actions;
