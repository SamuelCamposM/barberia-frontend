export interface PageItem {
  [key: string]: string | string[] | number;
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
}

export interface MenuState {
  rows: PageItem[];
  openModal: boolean;
  rowActive: PageItem;
}
