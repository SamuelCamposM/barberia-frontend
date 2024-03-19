import { LazyExoticComponent } from "react";
type JSXComponent = () => JSX.Element;

export interface Rol {
  _id: string;
  nombre: string;
}
export interface PageItem {
  _id: string;
  nombre: string;
  icono: string;
  orden: number;
  delete: Rol[];
  update: Rol[];
  insert: Rol[];
  select: Rol[];
  createdAt: string;
  updatedAt: string;
  Component?: LazyExoticComponent<JSXComponent> | JSXComponent;
}

export interface MenuState {
  rows: PageItem[];
  openModal: boolean;
  rowActive: PageItem;
}
