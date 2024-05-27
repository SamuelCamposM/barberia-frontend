import { clienteAxios } from "../../../../api";
import {
  Column,
  ErrorBackend,
  Pagination,
} from "../../../../interfaces/global";
import { paginationDefault } from "../../../../helpers/const";
import { CierreCajaItem, setDataProps } from "../interfaces";

export const columns: Column[] = [ 
  {
    campo: "fecha",
    label: "Fecha",
    minWidth: 100,
    sortable: true,
  },
  {
    campo: "sucursal.name",
    label: "Sucursal",
    minWidth: 100,
    sortable: true,
  },
  {
    campo: "totalDinero",
    label: "$ Total",
    minWidth: 100,
    sortable: true,
  },
  {
    campo: "totalCompras",
    label: "$ Compras",
    minWidth: 100,
    sortable: true,
  },
  {
    campo: "totalVentas",
    label: "$ Ventas",
    minWidth: 100,
    sortable: true,
  },
];
export const sortDefault = { asc: true, campo: "name" };

// Definición del objeto por defecto para una nueva cierreCaja
export const itemDefault: CierreCajaItem = {
  fecha: "",
  sucursal: {
    _id: "",
    name: "",
    tel: "",
  },
  totalCompras: 0,
  totalDinero: 0,
  totalVentas: 0,
};

interface Result extends Pagination {
  docs: CierreCajaItem[];
}

interface MyResponse {
  result: Result;
}

type getCierreCajasType = (arg: setDataProps) => Promise<{
  error: ErrorBackend;
  result: Result;
}>;

export const getCierreCajas: getCierreCajasType = async (
  params: setDataProps
) => {
  try {
    const {
      data: {
        result
      },
    } = await clienteAxios.post<MyResponse>("/cierreCaja", params);

    return {
      error: {
        error: false,
        msg: "",
      },
      result
    };
  } catch (error: any) {
    const errorResult = {
      msg: error?.response?.data?.msg || "Error al consultar lascierre cajas",
      error: true,
    };
    return { error: errorResult, result: { docs: [], ...paginationDefault } };
  }
};
