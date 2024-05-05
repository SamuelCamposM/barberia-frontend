import { Crud, Pagination, Sort } from "../../../../interfaces/global";
import { ProveedorForeign } from "../../Proveedor";
import { SucursalForeign } from "../../Sucursal";
import { UsuarioForeign } from "../../Usuario";
export interface CompraItem {
  estado: "EN PROCESO" | "FINALIZADA" | "ANULADA";
  eUsuario?: UsuarioForeign;
  gastoTotal: number;
  proveedor: ProveedorForeign;
  rUsuario: UsuarioForeign;
  sucursal: SucursalForeign;
  totalProductos: number;
  createdAt: string;
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
