import { Crud } from "../../../../interfaces/global";
import { Roles } from "../../../../store/interfaces";
import { UsuarioForeign } from "../../Usuario";

export interface PageItem {
  icono: string;
  delete: Roles[];
  update: Roles[];
  insert: Roles[];
  ver: Roles[];
  padre: string;
  tipo: "SECCION" | "ITEM";
  // permisoSelect: boolean;
  select: Roles[]; //QUE SOLO PUEDA VER REGISROS CREADOS POR EL
  createdAt: string;
  updatedAt: string;
  orden: number;
  nombre: string; //NOMBRE QUE SE VE EN PANTALLA
  componente: string; // NOMBRE DEL ARCHIVO A RENDERIZAR
  rUsuario: UsuarioForeign;
  eUsuario?: UsuarioForeign;
  _id?: string;
  crud?: Crud;
}

export interface setDataProps {
  busqueda: string;
}
export interface PageState {
  data: PageItem[];
  openModal: boolean;
  itemActive: PageItem;
  itemDefault: PageItem;
  count: number;
  cargando: boolean;
}
