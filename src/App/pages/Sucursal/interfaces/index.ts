import { Crud, Pagination, Sort } from "../../../../interfaces/global";
import { DeptoItem } from "../../Depto";
import { Municipio } from "../../Depto/components/Municipio/interfaces";
 

interface MunicipioWithDepto extends Omit<Municipio, "depto"> {
  depto: DeptoItem;
}
export interface SucursalItem {
  municipio: MunicipioWithDepto;
  name: string;
  tel: string;
  direccion: string;
  estado: boolean;
  _id?: string;
  crud?: Crud;
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
