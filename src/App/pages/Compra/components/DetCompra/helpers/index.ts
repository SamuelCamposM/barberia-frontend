import { clienteAxios } from "../../../../../../api";
import { Column, ErrorBackend } from "../../../../../../interfaces/global";
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
    sortable: false,
  },
  {
    campo: "cantidad",
    label: "cantidad",
    required: true,
    minWidth: 50,
    sortable: false,
  },
  {
    campo: "Precio",
    label: "Precio",
    required: true,
    minWidth: 50,
    sortable: false,
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

interface MyResponse {
  data: { result: DetCompraItem[] };
}

type getDetComprasType = (arg: setDataProps) => Promise<{
  error: ErrorBackend;
  result: DetCompraItem[];
}>;

export const getDetCompras: getDetComprasType = async (args: setDataProps) => {
  try {
    const data: MyResponse = await clienteAxios.post("/compra/detCompra", args);

    return {
      error: {
        error: false,
        msg: "",
      },
      result: data.data.result,
    };
  } catch (error: any) {
    const errorResult = {
      msg:
        error?.response?.data?.msg ||
        "Error al consultar los detalles de compras",
      error: true,
    };
    return { error: errorResult, result: [] };
  }
};
