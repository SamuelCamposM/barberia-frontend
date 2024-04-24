import { Crud } from "../../../../interfaces/global";
import { Roles } from "../../../../store/interfaces";

export interface PageItem {
  _id: string;
  nombre: string;
  icono: string;
  delete: Roles[];
  update: Roles[];
  insert: Roles[];
  select: Roles[];
  ver: Roles[];
  createdAt: string;
  updatedAt: string;
  orden: number;
  componente: string;
  crud?: Crud;
}

export interface MenuState {
  data: PageItem[];
  openModal: boolean;
  itemActive: PageItem;
  itemDefault: PageItem;
  count: number;
  cargando: boolean;
}
