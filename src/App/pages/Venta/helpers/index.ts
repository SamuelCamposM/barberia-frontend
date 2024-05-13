import { clienteAxios } from "../../../../api";
import {
  Column,
  ErrorBackend,
  Pagination,
} from "../../../../interfaces/global";
import { paginationDefault } from "../../../../helpers/const";
import { VentaItem, setDataProps } from "../interfaces";
import { formatUsuarioForeign } from "../../../../helpers";

export enum SocketOnVenta {
  agregar = "cliente:venta-agregar",
  editar = "cliente:venta-editar",
  eliminar = "cliente:venta-eliminar",
  detVentaListener = "cliente:venta-detVenta-listener",
}
export enum SocketEmitVenta {
  agregar = "server:venta-agregar",
  editar = "server:venta-editar",
  eliminar = "server:venta-eliminar",
}

export const columns: Column[] = [
  { campo: "", label: "", minWidth: 50, align: "center", sortable: false },

  {
    campo: "proveedor.nombreCompleto",
    label: "Cliente",
    required: true,
    minWidth: 150,
    sortable: true,
  },
  {
    campo: "sucursal.name",
    label: "Sucursal",
    required: true,
    minWidth: 150,
    sortable: true,
  },

  {
    align: "center",
    campo: "totalProductos",
    label: "N. Prods",
    minWidth: 100,
    required: false,
    sortable: true,
  },
  {
    align: "center",
    campo: "gastoTotal",
    label: "$",
    required: false,
    minWidth: 75,
    sortable: true,
  },
  {
    campo: "rUsuario.name",
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
export const sortDefault = { asc: true, campo: "name" };

// Definición del objeto por defecto para un nuevo departamento.
export const itemDefault: VentaItem = {
  estado: true,
  gastoTotal: 0,
  totalProductos: 0,
  createdAt: "",
  updatedAt: "",
  detVentasData: [],
  cliente: {
    _id: "",
    lastname: "",
    name: "",
  },
  rUsuario: formatUsuarioForeign(),
  eUsuario: formatUsuarioForeign(),
  sucursal: {
    _id: "",
    name: "",
    tel: "",
  },
};
export const calcularTotales = (detVentasData: VentaItem["detVentasData"]) => {
  const gastoTotal = detVentasData.reduce((suma, item) => suma + item.total, 0);
  const totalProductos = detVentasData.reduce(
    (suma, item) => suma + item.cantidad,
    0
  );

  return { gastoTotal, totalProductos };
};

interface Result extends Pagination {
  docs: VentaItem[];
}

interface MyResponse {
  data: { result: Result };
}

type getVentasType = (arg: setDataProps) => Promise<{
  error: ErrorBackend;
  result: Result;
}>;

export const getVentas: getVentasType = async (arg: setDataProps) => {
  try {
    const {
      data: {
        result: { docs, limit, page, totalDocs, totalPages },
      },
    }: MyResponse = await clienteAxios.post("/venta", arg);

    return {
      error: {
        error: false,
        msg: "",
      },
      result: { docs, limit, page, totalDocs, totalPages },
    };
  } catch (error: any) {
    const errorResult = {
      msg: error?.response?.data?.msg || "Error al consultar los departamentos",
      error: true,
    };
    return { error: errorResult, result: { docs: [], ...paginationDefault } };
  }
};
