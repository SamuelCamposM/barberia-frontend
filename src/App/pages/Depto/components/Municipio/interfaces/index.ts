import { Crud, Pagination, Sort } from "../../../../../../interfaces/global";

export interface setDataProps {
  busqueda: string;
  depto: string;
  pagination: Pagination;
  sort: Sort;
}

export interface MunicipioItem {
  depto: string;
  name: string;
  _id?: string;
  crud?: Crud;
}
