import { clienteAxios } from "../../../../../../api";
import { Column, ErrorBackend } from "../../../../../../interfaces/global";
import { DetVentaItem, setDataProps } from "../interfaces";
export enum SocketOnDetVenta {
  agregar = "cliente:detVenta-agregar",
  editar = "cliente:detVenta-editar",
  eliminar = "cliente:detVenta-eliminar",
}

export enum SocketEmitDetVenta {
  agregar = "server:detVenta-agregar",
  editar = "server:detVenta-editar",
  eliminar = "server:detVenta-eliminar",
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
export const itemDefault: DetVentaItem = {
  venta: "",
  cantidad: 0,
  precioUnidad: 0,
  total: 0,
  producto: {
    _id: "",
    name: "",
  },
};

interface MyResponse {
  data: { result: DetVentaItem[] };
}

type getDetVentasType = (arg: setDataProps) => Promise<{
  error: ErrorBackend;
  result: DetVentaItem[];
}>;

export const getDetVentas: getDetVentasType = async (args: setDataProps) => {
  try {
    const data: MyResponse = await clienteAxios.post("/venta/detVenta", args);

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
        "Error al consultar los detalles de ventas",
      error: true,
    };
    return { error: errorResult, result: [] };
  }
};
