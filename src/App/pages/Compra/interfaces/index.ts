import { Crud, Pagination, Sort } from "../../../../interfaces/global";
import { ProveedorForeign } from "../../Proveedor";
import { SucursalForeign } from "../../Sucursal";
import { UsuarioForeign } from "../../Usuario";
export interface CompraItem {
  proveedor: ProveedorForeign;
  sucursal: SucursalForeign;
  gastoTotal: number;
  totalMunicipios?: number;
  rUsuario: UsuarioForeign;
  eUsuario?: UsuarioForeign;
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
