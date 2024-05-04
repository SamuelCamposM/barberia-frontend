import { Crud, Pagination, Sort } from "../../../../interfaces/global";
export interface ProveedorForeign {
  nombreCompleto: string;
  _id: string;
}
export interface ProveedorItem {
  nombreCompleto: string;
  telefono: string;
  email: string;
  estado: boolean;
  _id?: string;
  crud?: Crud;
}

export interface ProveedorState {
  cargando: boolean;
  data: ProveedorItem[];
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
