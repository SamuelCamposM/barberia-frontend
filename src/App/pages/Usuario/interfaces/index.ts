import { Crud, Pagination, Sort } from "../../../../interfaces/global";
import { Roles } from "../../../../store/interfaces";

export interface UsuarioItem {
  _id?: string | undefined;
  crud?: Crud | undefined;
  email: string;
  estado: boolean;
  lastname: string;
  name: string;
  online: boolean;
  photo: string;
  rol: Roles;
  tel: string;
  createdAt: string;
  updatedAt: string;
}

export interface setDataProps {
  busqueda: string;
  pagination: Pagination;
  sort: Sort;
}
export interface UsuarioState {
  openModal: boolean;
  itemActive: UsuarioItem;
  itemDefault: UsuarioItem;
}
