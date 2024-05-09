import { Crud, Pagination, Sort } from "../../../../../../interfaces/global";
import { ProductoForeign } from "../../../../Producto";

export interface setDataProps {
  busqueda: string;
  compra: string;
  pagination: Pagination;
  sort: Sort;
}

export interface DetCompraItem {
  compra: string;
  producto: ProductoForeign;
  cantidad: number;
  precioUnidad: number;
  total: number;
  _id?: string;
  crud?: Crud;
}
