import { clienteAxios } from "../../../../api";
import {
  Column,
  ErrorBackend,
  Pagination,
} from "../../../../interfaces/global";
import { paginationDefault } from "../../../../helpers/const";
import { ProveedorItem, setDataProps } from "../interfaces";

export enum SocketOnProveedor {
  agregar = "cliente:proveedor-agregar",
  editar = "cliente:proveedor-editar",
  eliminar = "cliente:proveedor-eliminar",
}

export enum SocketEmitProveedor {
  agregar = "server:proveedor-agregar",
  editar = "server:proveedor-editar",
  eliminar = "server:proveedor-eliminar",
}

export const columns: Column[] = [
  { campo: "", label: "", minWidth: 50, align: "center", sortable: false },
  {
    campo: "nombreCompleto",
    label: "Nombre Completo",
    required: true,
    minWidth: 100,
    sortable: true,
  },
  {
    campo: "email",
    label: "Email",
    required: true,
    minWidth: 100,
    sortable: true,
  },

  {
    campo: "telefono",
    label: "Teléfono",
    required: true,
    minWidth: 100,
    sortable: true,
  },
];
export const sortDefault = { asc: true, campo: "name" };

// Definición del objeto por defecto para una nueva proveedor
export const itemDefault: ProveedorItem = {
  email: "",
  nombreCompleto: "",
  telefono: "",
  estado: true,
};

interface Result extends Pagination {
  docs: ProveedorItem[];
}

interface MyResponse {
  result: Result;
}

type getProveedorsType = (arg: setDataProps) => Promise<{
  error: ErrorBackend;
  result: Result;
}>;

export const getProveedors: getProveedorsType = async (
  params: setDataProps
) => {
  try {
    const {
      data: {
        result: { docs, limit, page, totalDocs, totalPages },
      },
    } = await clienteAxios.post<MyResponse>("/proveedor", params);

    return {
      error: {
        error: false,
        msg: "",
      },
      result: { docs, limit, page, totalDocs, totalPages },
    };
  } catch (error: any) {
    const errorResult = {
      msg: error?.response?.data?.msg || "Error al consultar las categorías",
      error: true,
    };
    return { error: errorResult, result: { docs: [], ...paginationDefault } };
  }
};
