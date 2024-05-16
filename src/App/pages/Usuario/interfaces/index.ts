import { Crud, Pagination, Sort } from "../../../../interfaces/global";
import { Roles } from "../../../../store/interfaces";
import { SucursalForeign } from "../../Sucursal";

export type ClienteForeign = Omit<UsuarioForeign, "dui">;
export interface UsuarioForeign {
  _id: string;
  dui: string;
  name: string;
  lastname: string;
  tel: string;
}

export interface UsuarioItem {
  _id?: string | undefined;
  crud?: Crud | undefined;
  email: string;
  estado: boolean;
  lastname: string;
  dui: string;
  name: string;
  online: boolean;
  photo: string;
  rol: Roles;
  tel: string;
  sucursal?: SucursalForeign;
  createdAt: string;
  updatedAt: string;
}

export interface setDataProps {
  busqueda: string;
  pagination: Pagination;
  sort: Sort;
  rol: Roles;
  estado: boolean;
}
export interface UsuarioState {
  openModal: boolean;
  itemActive: UsuarioItem;
  itemDefault: UsuarioItem;
}
