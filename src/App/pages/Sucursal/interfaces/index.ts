import { Crud, Pagination, Sort } from "../../../../interfaces/global";
import { DeptoForeign } from "../../Depto";
import { MunicipioForeign } from "../../Depto/components/Municipio/interfaces";

export interface SucursalForeign {
  name: string;
  tel: string;
  _id: string;
}

export interface SucursalItem {
  direccion: string;
  estado: boolean;
  municipio: MunicipioForeign;
  depto: DeptoForeign;
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
