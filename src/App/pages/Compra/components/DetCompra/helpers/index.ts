import { clienteAxios } from "../../../../../../api";
import {
  Column,
  ErrorBackend,
  Pagination,
} from "../../../../../../interfaces/global";
import { paginationDefault } from "../../../../../../helpers";
import { DetCompraItem, setDataProps } from "../interfaces";
export enum SocketOnDetCompra {
  agregar = "cliente:detCompra-agregar",
  editar = "cliente:detCompra-editar",
  eliminar = "cliente:detCompra-eliminar",
}

export enum SocketEmitDetCompra {
  agregar = "server:detCompra-agregar",
  editar = "server:detCompra-editar",
  eliminar = "server:detCompra-eliminar",
}

export const columns: Column[] = [
  { campo: "", label: "", minWidth: 50, align: "center", sortable: false },

  {
    campo: "producto.name",
    label: "Producto",
    required: true,
    minWidth: 50,
    sortable: true,
  },
  {
    campo: "cantidad",
    label: "cantidad",
    required: true,
    minWidth: 50,
    sortable: true,
  },
  {
    campo: "Precio",
    label: "Precio",
    required: true,
    minWidth: 50,
    sortable: true,
  },
  {
    campo: "total",
    label: "total",
    required: false,
    minWidth: 50,
    sortable: false,
  },
];
export const itemDefault: DetCompraItem = {
  compra: "",
  cantidad: 0,
  precioUnidad: 0,
  total: 0,
  producto: {
    _id: "",
    name: "",
  },
};

interface Result extends Pagination {
  docs: DetCompraItem[];
}

interface MyResponse {
  data: { result: Result };
}

type getDetComprasType = (arg: setDataProps) => Promise<{
  error: ErrorBackend;
  result: Result;
}>;

export const getDetCompras: getDetComprasType = async (args: setDataProps) => {
  try {
    const data: MyResponse = await clienteAxios.post("/detCompra", args);

    console.log({ data });

    return {
      error: {
        error: false,
        msg: "",
      },
      result: data.data.result,
    };
  } catch (error: any) {
    const errorResult = {
      msg: error?.response?.data?.msg || "Error al consultar los departamentos",
      error: true,
    };
    return { error: errorResult, result: { docs: [], ...paginationDefault } };
  }
};
