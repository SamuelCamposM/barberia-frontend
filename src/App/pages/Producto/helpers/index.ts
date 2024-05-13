import { clienteAxios } from "../../../../api";
import {
  Column,
  ErrorBackend,
  Pagination,
} from "../../../../interfaces/global";
import { paginationDefault } from "../../../../helpers/const";
import { TipoProducto, ProductoItem, setDataProps } from "../interfaces";
import { formatUsuarioForeign } from "../../../../helpers";

export enum SocketOnProducto {
  agregar = "cliente:producto-agregar",
  editar = "cliente:producto-editar",
  eliminar = "cliente:producto-eliminar",
}

export enum SocketEmitProducto {
  agregar = "server:producto-agregar",
  editar = "server:producto-editar",
  eliminar = "server:producto-eliminar",
}
export const tiposProducto: TipoProducto[] = ["PRODUCTO", "SERVICIO"];
export const columns: Column[] = [
  { campo: "", label: "", minWidth: 10, align: "center", sortable: false },
  {
    campo: "photos",
    label: "Foto",
    align: "left",
    minWidth: 100,
    sortable: false,
  },
  {
    campo: "name",
    label: "Nombre",
    align: "left",
    minWidth: 100,
    sortable: true,
  },
  {
    campo: "price",
    label: "Precio",
    align: "center",
    minWidth: 100,
    sortable: true,
  },
  {
    campo: "stockTotal",
    label: "Stock",
    align: "center",
    minWidth: 100,
    sortable: true,
  },
  {
    campo: "tipoProducto",
    label: "T. Producto",
    align: "center",
    minWidth: 150,
    sortable: true,
  },
  {
    campo: "categoria.name",
    label: "Categoria",
    align: "center",
    minWidth: 100,
    sortable: true,
  },
  {
    campo: "marca.name",
    label: "Marca",
    align: "center",
    minWidth: 100,
    sortable: true,
  },
  {
    campo: "rUsuario.lastname",
    label: "R. Usuario",
    required: true,
    minWidth: 150,
    sortable: true,
  },
  {
    campo: "createdAt",
    label: "Fec. Reg.",
    required: false,
    minWidth: 150,
    sortable: true,
  },
];

export const sortDefault = { asc: false, campo: "name" };

export const itemDefault: ProductoItem = {
  categoria: {
    _id: "",
    name: "",
  },
  marca: {
    _id: "",
    name: "",
  },
  rUsuario: formatUsuarioForeign(),
  description: "",
  eUsuario: formatUsuarioForeign(),
  stocks: [],
  estado: true,
  name: "",
  photos: [],
  price: 0,
  stockTotal: 0,
  tipoProducto: "PRODUCTO",
  createdAt: "",
  updatedAt: "",
};

interface Result extends Pagination {
  docs: ProductoItem[];
}

interface MyResponse {
  result: Result;
}

type getProductosType = (params: setDataProps) => Promise<{
  error: ErrorBackend;
  result: Result;
}>;

export const getProductos: getProductosType = async (params) => {
  try {
    const {
      data: {
        result: { docs, limit, page, totalDocs, totalPages },
      },
    } = await clienteAxios.post<MyResponse>("/producto", params);
    console.log({ docs });
    return {
      error: {
        error: false,
        msg: "",
      },
      result: { docs, limit, page, totalDocs, totalPages },
    };
  } catch (error: any) {
    return {
      error: {
        error: true,
        msg: error?.response?.data?.msg || "Error al consultar las productos",
      },
      result: { docs: [], ...paginationDefault },
    };
  }
};
