import { Crud, Pagination } from "../../../../interfaces/global";

export interface DeptoItem {
  name: string;
  totalMunicipios?: number;
  _id?: string;
  crud?: Crud;
}

export interface DeptoState {
  cargando: boolean;
  agregando: boolean;
  rowDefault: DeptoItem;
  data: DeptoItem[];
  isSearching: boolean;
  pagination: Pagination;
}
