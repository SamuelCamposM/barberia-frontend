import { Crud, Pagination, Sort } from "../../../../interfaces/global";
import { CategoriaForeign } from "../../Categoria";
import { MarcaForeign } from "../../Marca";
import { UsuarioForeign } from "../../Usuario";

export type TipoProducto = "PRODUCTO" | "SERVICIO";

export interface ProductoForeignWithStock extends ProductoForeign {
  stocks: StockItem[];
  price: number;
}
export interface ProductoForeign {
  _id: string;
  name: string;
}
export interface StockItem {
  _id: string;
  sucursal: string;
  cantidad: number;
}

export interface ProductoItem {
  photos: string[];
  stocks: StockItem[];
  name: string;
  description?: string;
  price: number;
  marca: MarcaForeign;
  categoria: CategoriaForeign;
  tipoProducto: TipoProducto;
  rUsuario: UsuarioForeign;
  eUsuario?: UsuarioForeign;
  estado: boolean;
  createdAt: string;
  updatedAt: string;
  stockTotal: number;
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
