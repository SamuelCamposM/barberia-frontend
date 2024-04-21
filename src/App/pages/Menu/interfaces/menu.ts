import { Crud } from "../../../../interfaces/global";

export interface PageItem {
  _id: string;
  nombre: string;
  icono: string;
  delete: string[];
  update: string[];
  insert: string[];
  select: string[];
  ver: string[];
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
}
