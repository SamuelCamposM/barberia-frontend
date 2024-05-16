import { Crud, Pagination, Sort } from "../../../../interfaces/global";
import { SucursalForeign } from "../../Sucursal";
import { ClienteForeign, UsuarioForeign } from "../../Usuario";

export type EstadoCita = "PENDIENTE" | "FINALIZADA" | "ANULADA" | "AUSENCIA";

export interface CitaItem {
  titulo: string;
  fecha: string;
  description: string;
  sucursal: SucursalForeign;
  estadoCita: EstadoCita;
  empleado: UsuarioForeign;
  rUsuario: ClienteForeign;
  createdAt: string;
  _id?: string | undefined;
  crud?: Crud | undefined;
}

export interface setDataProps {
  busqueda: string;
  pagination: Pagination;
  sort: Sort;
  estadoCita: EstadoCita;
}
export interface CitaState {
  openModal: boolean;
  itemActive: CitaItem;
  itemDefault: CitaItem;
}
