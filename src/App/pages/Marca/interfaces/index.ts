import { Crud, Pagination, Sort } from "../../../../interfaces/global";
export interface MarcaItem {
  name: string;
  estado: boolean;
  _id?: string;
  crud?: Crud;
}

export interface MarcaState {
  cargando: boolean;
  data: MarcaItem[];
  pagination: Pagination;
}
export interface setDataProps {
  busqueda: string;
  pagination: Pagination;
  sort: Sort;
  estado: boolean;
}
export interface handleEventProps {
  newPagination?: Pagination;
  newSort?: Sort;
  newEstadoValue?: boolean;
}
