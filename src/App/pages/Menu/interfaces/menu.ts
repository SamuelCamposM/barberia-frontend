import { Crud } from "../../../../interfaces/global";
import { Roles } from "../../../../store/interfaces";

export interface PageItem {
  _id: string;
  icono: string;
  delete: Roles[];
  update: Roles[];
  insert: Roles[];
  ver: Roles[];

  // permisoSelect: boolean;
  select: Roles[]; //QUE SOLO PUEDA VER REGISROS CREADOS POR EL
  createdAt: string;
  updatedAt: string;
  orden: number;
  nombre: string; //NOMBRE QUE SE VE EN PANTALLA
  componente: string; // NOMBRE DEL ARCHIVO A RENDERIZAR
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
