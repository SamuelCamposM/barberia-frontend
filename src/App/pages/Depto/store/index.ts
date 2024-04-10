import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DeptoItem, DeptoState } from "../interfaces";
import { Pagination } from "../../../../interfaces/global";
import { paginationDefault } from "../../../../helpers";

const initialState: DeptoState = {
  cargando: true,
  data: [],
  pagination: paginationDefault,
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
      }>
    ) => {
      state.data = action.payload.docs;
      state.pagination = action.payload.paginationResult;
      state.cargando = false;
    },
    onSliceEditDepto: (state, action: PayloadAction<DeptoItem>) => {
      state.data = state.data.map((item) =>
        item._id === action.payload._id
          ? { ...action.payload, crud: { editado: true } }
          : item
      );
    },
    onSliceAddOrRemoveMunicipio: (
      state,
      action: PayloadAction<{
        _id: string;
        tipo: "add" | "remove";
      }>
    ) => {
      state.data = state.data.map((item) =>
        item._id === action.payload._id
          ? {
              ...item,
              crud: { editado: true },
              totalMunicipios:
                action.payload.tipo === "add"
                  ? item.totalMunicipios! + 1
                  : action.payload.tipo === "remove"
                  ? item.totalMunicipios! - 1
                  : item.totalMunicipios,
            }
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
    // setSliceAgregando: (state, action: PayloadAction<boolean>) => {
    //   state.agregando = action.payload;
    // },
  },
});
export const {
  getSliceDataDepto,
  onSliceAgregarDepto,
  onSliceEditDepto,
  onSliceEliminarDepto,
  // setSliceAgregando,
  setSliceCargando,
  onSliceAddOrRemoveMunicipio,
} = deptoSlice.actions;
