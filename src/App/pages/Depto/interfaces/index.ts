import { Crud, Pagination, Sort } from "../../../../interfaces/global";
import { Municipio } from "../components/Municipio/interfaces";

export interface DeptoItem {
  name: string;
  totalMunicipios?: number;
  _id?: string;
  crud?: Crud;
  accionHijo?: {
    tipo: string;
    item: Municipio;
  };
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
