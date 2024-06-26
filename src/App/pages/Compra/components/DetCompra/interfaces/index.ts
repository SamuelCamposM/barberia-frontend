import { Crud, Sort } from "../../../../../../interfaces/global";
import { ProductoForeign } from "../../../../Producto";

export interface setDataProps {
  compra: string;
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
