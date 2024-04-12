import { Crud, Pagination, Sort } from "../../../../interfaces/global";

export interface MunicipioForSucursal {
  id: string;
  name: string;
  deptoName: string;
}
export interface SucursalItem {
  direccion: string;
  estado: boolean;
  municipio: MunicipioForSucursal;
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
