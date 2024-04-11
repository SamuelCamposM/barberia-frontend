import { Crud, Pagination, Sort } from "../../../../interfaces/global";
export interface DeptoItem {
  name: string;
  totalMunicipios?: number;
  _id?: string;
  crud?: Crud;
}

export interface DeptoState {
  cargando: boolean;
  data: DeptoItem[];
  pagination: Pagination;
}
export interface setDataProps {
  busqueda: string;
  pagination: Pagination;
  sort: Sort;
}
