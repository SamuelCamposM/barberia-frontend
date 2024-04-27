import { clienteAxios } from "../../../../api";
import {
  Column,
  ErrorBackend,
  Pagination,
} from "../../../../interfaces/global";
import { paginationDefault } from "../../../../helpers/const";
import { MarcaItem, setDataProps } from "../interfaces";

export enum SocketOnMarca {
  agregar = "cliente:marca-agregar",
  editar = "cliente:marca-editar",
  eliminar = "cliente:marca-eliminar",
}

export enum SocketEmitMarca {
  agregar = "server:marca-agregar",
  editar = "server:marca-editar",
  eliminar = "server:marca-eliminar",
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

// Definición del objeto por defecto para una nueva marca
export const itemDefault: MarcaItem = {
  name: "",
  estado: true,
};

interface Result extends Pagination {
  docs: MarcaItem[];
}

interface MyResponse {
  result: Result;
}

type getMarcasType = (arg: setDataProps) => Promise<{
  error: ErrorBackend;
  result: Result;
}>;

export const getMarcas: getMarcasType = async (params: setDataProps) => {
  try {
    const {
      data: {
        result: { docs, limit, page, totalDocs, totalPages },
      },
    } = await clienteAxios.post<MyResponse>("/marca", params);

    return {
      error: {
        error: false,
        msg: "",
      },
      result: { docs, limit, page, totalDocs, totalPages },
    };
  } catch (error: any) {
    const errorResult = {
      msg: error?.response?.data?.msg || "Error al consultar las marcas",
      error: true,
    };
    return { error: errorResult, result: { docs: [], ...paginationDefault } };
  }
};
