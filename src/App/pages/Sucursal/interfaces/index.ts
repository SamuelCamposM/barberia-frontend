import { Crud, Pagination, Sort } from "../../../../interfaces/global";

export interface MunicipioSuc {
  _id: string;
  name: string;
}
export interface DeptoSuc {
  _id: string;
  name: string;
}

export interface SucursalItem {
  direccion: string;
  estado: boolean;
  municipio: MunicipioSuc;
  depto: DeptoSuc;
  name: string;
  tel: string;
  _id?: string | undefined;
  crud?: Crud | undefined;
}

export interface SucursalState {
  cargando: boolean;
  data: SucursalItem[];
  pagination: Pagination;
}
export interface setDataProps {
  busqueda: string;
  pagination: Pagination;
  sort: Sort;
}
