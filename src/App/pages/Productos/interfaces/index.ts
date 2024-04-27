import { Crud, Pagination, Sort } from "../../../../interfaces/global";

export type TipoProducto = "PRODUCTO" | "SERVICIO";
interface ProductoMarca {
  _id: string;
  name: string;
}

interface ProductoCategoria {
  _id: string;
  name: string;
}

interface ProductoUsuario {
  _id: string;
  name: string;
  dui: string;
}

 
export interface ProductoItem {
  photo: string;
  name: string;
  description?: string;
  price: number;
  marca: ProductoMarca;
  categoria: ProductoCategoria;
  tipoProducto: TipoProducto;
  rUsuario: ProductoUsuario;
  eUsuario?: ProductoUsuario;
  estado: boolean;
  createdAt: string;
  updatedAt: string;
  _id?: string | undefined;
  crud?: Crud | undefined;
}

export interface setDataProps {
  busqueda: string;
  pagination: Pagination;
  sort: Sort;
  tipoProducto: TipoProducto;
  estado: boolean;
}
export interface ProductoState {
  openModal: boolean;
  itemActive: ProductoItem;
  itemDefault: ProductoItem;
}
