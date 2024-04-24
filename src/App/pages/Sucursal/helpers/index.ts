import { clienteAxios } from "../../../../api";
import {
  Column,
  ErrorBackend,
  Pagination,
} from "../../../../interfaces/global";
import { paginationDefault } from "../../../../helpers/const";
import {
  DeptoSuc,
  MunicipioSuc,
  SucursalItem,
  setDataProps,
} from "../interfaces";
import { toast } from "react-toastify";
export enum SocketOnSucursal {
  agregar = "cliente:sucursal-agregar",
  editar = "cliente:sucursal-editar",
  eliminar = "cliente:sucursal-eliminar",
}

export enum SocketEmitSucursal {
  agregar = "server:sucursal-agregar",
  editar = "server:sucursal-editar",
  eliminar = "server:sucursal-eliminar",
}

export const columns: Column[] = [
  { campo: "", label: "", minWidth: 10, align: "center", sortable: false },
  {
    campo: "municipio.name",
    label: "Departamento",
    minWidth: 175,
    sortable: true,
    required: true,
  },
  {
    campo: "depto.name",
    label: "Municipio",
    minWidth: 175,
    sortable: true,
    required: true,
  },
  {
    campo: "name",
    label: "Sucursal",
    minWidth: 175,
    sortable: true,
    required: true,
  },
  { campo: "tel", label: "tel", minWidth: 100, sortable: true, required: true },
  {
    campo: "direccion",
    label: "direccion",
    minWidth: 200,
    sortable: true,
    required: true,
  },
];

export const sortDefault = { asc: true, campo: "municipio.name" };

export const itemDefault: SucursalItem = {
  direccion: "",
  estado: true,
  municipio: {
    _id: "", //ID MUNICIPIO
    name: "", // Aquí se almacena el nombre del municipio
  },
  depto: {
    _id: "", //ID MUNICIPIO
    name: "", // Aquí se almacena el nombre del municipio
  },
  name: "",
  tel: "",
};
interface Result extends Pagination {
  docs: SucursalItem[];
}

interface MyResponse {
  data: { result: Result };
}

type getSucursalsType = ({
  busqueda,
  pagination,
  sort,
}: setDataProps) => Promise<{
  error: ErrorBackend;
  result: Result;
}>;

export const getSucursals: getSucursalsType = async ({
  busqueda,
  pagination,
  sort,
}: setDataProps) => {
  try {
    const {
      data: {
        result: { docs, limit, page, totalDocs, totalPages },
      },
    }: MyResponse = await clienteAxios.post("/sucursal", {
      pagination,
      sort,
      busqueda,
    });

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
        msg: error?.response?.data?.msg || "Error al consultar las sucursales",
      },
      result: { docs: [], ...paginationDefault },
    };
  }
};

// Define la estructura de la respuesta
interface searchDeptoResponse {
  data: DeptoSuc[];
  error: ErrorBackend;
}

export interface searchDeptoProps {
  search: string;
}
export const searchDepto = async (
  searchProps: searchDeptoProps
): Promise<searchDeptoResponse> => {
  try {
    console.log(searchProps);

    const res: searchDeptoResponse = await clienteAxios.post(
      "/depto/search",
      searchProps
    );
    // return { data: [], error: true };
    if (res.data.length === 0) {
      toast.error("No se encontraron departamentos");
    }
    return {
      data: res.data,
      error: {
        error: false,
        msg: "",
      },
    };
  } catch (error: any) {
    const msgError =
      error?.response?.data?.msg || "Error al consultar los departamentos";
    toast.error(msgError);
    return {
      error: {
        error: true,
        msg: msgError,
      },
      data: [],
    };
  }
};

// Define la estructura de la respuesta
interface searchMunicipioResponse {
  data: MunicipioSuc[];
  error: ErrorBackend;
}

export interface searchMunicipioProps {
  search: string;
  deptoId: string;
}
export const searchMunicipio = async (
  searchProps: searchMunicipioProps
): Promise<searchMunicipioResponse> => {
  try {
    const res: searchMunicipioResponse = await clienteAxios.post(
      "/municipio/searchByDepto",
      searchProps
    );
    if (res.data.length === 0) {
      toast.error("No se encontraron municipios");
    }
    return {
      data: res.data,
      error: {
        error: false,
        msg: "",
      },
    };
  } catch (error: any) {
    const msgError =
      error?.response?.data?.msg || "Error al consultar los municipios";
    toast.error(msgError);
    return {
      error: {
        error: true,
        msg: msgError,
      },
      data: [],
    };
  }
};
