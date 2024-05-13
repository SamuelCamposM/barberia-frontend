import { Crud, Sort } from "../../../../../../interfaces/global";
import { ProductoForeignWithStock } from "../../../../Producto";

export interface setDataProps {
  venta: string;
  sort: Sort;
}

export interface DetVentaItem {
  venta: string;
  producto: ProductoForeignWithStock;
  cantidad: number;
  precioUnidad: number;
  stock: number;
  total: number;
  _id?: string;
  crud?: Crud;
}
