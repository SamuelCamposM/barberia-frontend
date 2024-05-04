import { Crud, Pagination, Sort } from "../../../../interfaces/global";
export interface CompraItem {
  proveedor: {
    _id: string;
    nombreCompleto: string;
    telefono: string;
    email: string;
  };
  sucursal: {
    _id: string;
    name: string;
    tel: string;
  };
  gastoTotal: number;
  totalMunicipios?: number;
  rUsuario: { _id: string; name: string; dui: string };
  eUsuario?: { _id: string; name: string; dui: string };
  estado: "EN PROCESO" | "FINALIZADA" | "ANULADA";
  _id?: string;
  crud?: Crud;
}

export interface CompraState {
  cargando: boolean;
  data: CompraItem[];
  pagination: Pagination;
}
export interface setDataProps {
  busqueda: string;
  pagination: Pagination;
  sort: Sort;
  estado: CompraItem["estado"];
}
