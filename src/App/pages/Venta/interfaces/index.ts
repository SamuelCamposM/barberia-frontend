import { Crud, Pagination, Sort } from "../../../../interfaces/global";
import { ProveedorForeign } from "../../Proveedor";
import { SucursalForeign } from "../../Sucursal";
import { UsuarioForeign } from "../../Usuario";
import { DetVentaItem } from "../components/DetVenta/interfaces";
export interface VentaItem {
  estado: boolean;
  eUsuario?: UsuarioForeign;
  gastoTotal: number;
  proveedor: ProveedorForeign;
  rUsuario: UsuarioForeign;
  sucursal: SucursalForeign;
  totalProductos: number;
  createdAt: string;
  updatedAt: string;
  detVentasData: DetVentaItem[];
  _id?: string;
  crud?: Crud;
}

// export interface VentaState {
//   cargando: boolean;
//   data: VentaItem[];
//   pagination: Pagination;
// }
export interface setDataProps {
  busqueda: string;
  pagination: Pagination;
  sort: Sort;
  estado: VentaItem["estado"];
}

export interface VentaState {
  openModal: boolean;
  itemActive: VentaItem;
  itemDefault: VentaItem;
}
