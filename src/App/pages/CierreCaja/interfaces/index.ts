import { Crud, Pagination, Sort } from "../../../../interfaces/global";
import { SucursalForeign } from "../../Sucursal";

export interface CierreCajaItem {
  fecha: string;
  sucursal: SucursalForeign; // Esto debería ser el ID de la sucursal en tu base de datos
  totalDinero: number;
  totalCompras: number;
  totalVentas: number;
  _id?: string;
  crud?: Crud;
}

export interface CierreCajaState {
  cargando: boolean;
  data: CierreCajaItem[];
  pagination: Pagination;
}
export interface setDataProps {
  busqueda: string;
  pagination: Pagination;
  sort: Sort;
}
export interface handleEventProps {
  newPagination?: Pagination;
  newSort?: Sort;
  newEstadoValue?: boolean;
}
