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
  agregando: boolean;
  rowDefault: DeptoItem;
  data: DeptoItem[];
  isSearching: boolean;
  pagination: Pagination;
  sort: Sort;
}
