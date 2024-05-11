import { Crud, Sort } from "../../../../../../interfaces/global";
import { ProductoForeign } from "../../../../Producto";

export interface setDataProps {
  venta: string;
  sort: Sort;
}

export interface DetVentaItem {
  venta: string;
  producto: ProductoForeign;
  cantidad: number;
  precioUnidad: number;
  total: number;
  _id?: string;
  crud?: Crud;
}
