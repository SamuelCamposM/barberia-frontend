import { clienteAxios } from "../../../../api";
import {
  Column,
  ErrorBackend,
  Pagination,
} from "../../../../interfaces/global";
import { paginationDefault } from "../../../../helpers/const";
import { CategoriaItem, setDataProps } from "../interfaces";

export enum SocketOnCategoria {
  agregar = "cliente:categoria-agregar",
  editar = "cliente:categoria-editar",
  eliminar = "cliente:categoria-eliminar",
}

export enum SocketEmitCategoria {
  agregar = "server:categoria-agregar",
  editar = "server:categoria-editar",
  eliminar = "server:categoria-eliminar",
}

export const columns: Column[] = [
  { campo: "", label: "", minWidth: 50, align: "center", sortable: false },
  {
    campo: "name",
    label: "Nombre",
    required: true,
    minWidth: 40,
    sortable: true,
  },
];
export const sortDefault = { asc: true, campo: "name" };

// Definición del objeto por defecto para una nueva categoria
export const itemDefault: CategoriaItem = {
  name: "",
  estado: true,
};

interface Result extends Pagination {
  docs: CategoriaItem[];
}

interface MyResponse {
  result: Result;
}

type getCategoriasType = (arg: setDataProps) => Promise<{
  error: ErrorBackend;
  result: Result;
}>;

export const getCategorias: getCategoriasType = async (params: setDataProps) => {
  try {
    const {
      data: {
        result: { docs, limit, page, totalDocs, totalPages },
      },
    } = await clienteAxios.post<MyResponse>("/categoria", params);

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
