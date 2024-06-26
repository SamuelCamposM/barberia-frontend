import { clienteAxios } from "../../../../api";
import {
  Column,
  ErrorBackend,
  Pagination,
} from "../../../../interfaces/global";
import { paginationDefault } from "../../../../helpers/const";
import { CompraItem, setDataProps } from "../interfaces";
import { formatUsuarioForeign } from "../../../../helpers";

export enum SocketOnCompra {
  agregar = "cliente:compra-agregar",
  editar = "cliente:compra-editar",
  eliminar = "cliente:compra-eliminar",
  detCompraListener = "cliente:compra-detCompra-listener",
}
export enum SocketEmitCompra {
  agregar = "server:compra-agregar",
  editar = "server:compra-editar",
  eliminar = "server:compra-eliminar",
}
export const estados: CompraItem["estado"][] = [
  "EN PROCESO",
  "FINALIZADA",
  "ANULADA",
];
export const columns: Column[] = [
  { campo: "", label: "", minWidth: 50, align: "center", sortable: false },

  {
    campo: "estado",
    label: "Estado",
    required: true,
    minWidth: 150,
    sortable: true,
  },
  {
    campo: "proveedor.nombreCompleto",
    label: "Proveedor",
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
export const sortDefault = { asc: true, campo: "name" };

// Definición del objeto por defecto para un nuevo departamento.
export const itemDefault: CompraItem = {
  estado: "EN PROCESO",
  gastoTotal: 0,
  totalProductos: 0,
  createdAt: "",
  updatedAt: "",
  detComprasData: [],
  proveedor: {
    _id: "",
    nombreCompleto: "",
  },
  rUsuario: formatUsuarioForeign(),
  eUsuario: formatUsuarioForeign(),
  sucursal: {
    _id: "",
    name: "",
    tel: "",
  },
};
export const calcularTotales = (
  detComprasData: CompraItem["detComprasData"]
) => {
  const gastoTotal = detComprasData.reduce(
    (suma, item) => suma + item.total,
    0
  );
  const totalProductos = detComprasData.reduce(
    (suma, item) => suma + item.cantidad,
    0
  );

  return { gastoTotal, totalProductos };
};

interface Result extends Pagination {
  docs: CompraItem[];
}

interface MyResponse {
  data: { result: Result };
}

type getComprasType = (arg: setDataProps) => Promise<{
  error: ErrorBackend;
  result: Result;
}>;

export const getCompras: getComprasType = async (arg: setDataProps) => {
  try {
    const {
      data: {
        result
      },
    }: MyResponse = await clienteAxios.post("/compra", arg);

    return {
      error: {
        error: false,
        msg: "",
      },
      result
    };
  } catch (error: any) {
    const errorResult = {
      msg: error?.response?.data?.msg || "Error al consultar los departamentos",
      error: true,
    };
    return { error: errorResult, result: { docs: [], ...paginationDefault } };
  }
};
