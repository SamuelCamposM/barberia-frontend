import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DeptoItem, DeptoState } from "../interfaces";
import { Pagination, Sort } from "../../../../interfaces/global";
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
  sort: {
    asc: true,
    campo: "name",
  },
};
export const deptoSlice = createSlice({
  name: "depto",
  initialState,
  reducers: {
    setSliceCargando: (state, action: PayloadAction<boolean>) => {
      state.cargando = action.payload;
    },
    getSliceDataDepto: (
      state,
      action: PayloadAction<{
        docs: DeptoItem[];
        paginationResult: Pagination;
        sort: Sort;
      }>
    ) => {
      // state.data = [
      //   ...action.payload.docs,
      //   ...action.payload.docs,
      //   ...action.payload.docs,
      //   ...action.payload.docs,
      //   ...action.payload.docs,
      //   ...action.payload.docs,
      //   ...action.payload.docs,
      //   ...action.payload.docs,
      //   ...action.payload.docs,
      //   ...action.payload.docs,
      //   ...action.payload.docs,
      //   ...action.payload.docs,
      //   ...action.payload.docs,
      //   ...action.payload.docs,
      //   ...action.payload.docs,
      //   ...action.payload.docs,
      //   ...action.payload.docs,
      //   ...action.payload.docs,
      //   ...action.payload.docs,
      //   ...action.payload.docs,
      //   ...action.payload.docs,
      //   ...action.payload.docs,
      //   ...action.payload.docs,
      //   ...action.payload.docs,
      //   ...action.payload.docs,
      //   ...action.payload.docs,
      // ].map((item, index) => ({
      //   ...item,
      //   _id: item._id + "a" + index,
      // }));
      state.data = action.payload.docs;
      state.pagination = action.payload.paginationResult;
      state.sort = action.payload.sort;
      state.cargando = false;
    },
    onSliceEditDepto: (state, action: PayloadAction<DeptoItem>) => {
      state.data = state.data.map((item) =>
        item._id === action.payload._id
          ? { ...action.payload, crud: { editado: true } }
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
      state.data = state.data.filter((item) => item._id !== action.payload);
      state.pagination = {
        ...state.pagination,
        totalDocs: state.pagination.totalDocs - 1,
      };
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
  onSliceEliminarDepto,
  setSliceAgregando,
  setSliceCargando,
} = deptoSlice.actions;
