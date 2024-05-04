import { Crud, Pagination, Sort } from "../../../../../../interfaces/global";

export interface setDataProps {
  busqueda: string;
  compra: string;
  pagination: Pagination;
  sort: Sort;
}

export interface MunicipioItem {
  compra: string;
  name: string;
  _id?: string;
  crud?: Crud;
}
