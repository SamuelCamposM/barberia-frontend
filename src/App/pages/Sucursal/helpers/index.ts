import { clienteAxios } from "../../../../api";
import {
  Column,
  ErrorBackend,
  Pagination,
} from "../../../../interfaces/global";
import { paginationDefault } from "../../../../helpers/const";
import { SucursalItem, setDataProps } from "../interfaces";
import { toast } from "react-toastify";
import { MunicipioForeign } from "../../Depto/components/Municipio/interfaces";
import { DeptoForeign } from "../../Depto";
import { handleAxiosError } from "../../../../helpers";
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

interface MyResponse extends Pagination {
  docs: SucursalItem[];
}

type getSucursalsType = (arg: setDataProps) => Promise<{
  error: ErrorBackend;
  result: MyResponse;
}>;

export const getSucursals: getSucursalsType = async (
  params: setDataProps
): Promise<{
  error: ErrorBackend;
  result: MyResponse;
}> => {
  try {
    const { data } = await clienteAxios.post<MyResponse>("/sucursal", params);

    return {
      error: {
        error: false,
        msg: "",
      },
      result: data,
    };
  } catch (error: any) {
    return {
      error: handleAxiosError(error, "Error al consultar las sucursales"),
      result: { docs: [], ...paginationDefault },
    };
  }
};

// Define la estructura de la respuesta
interface searchDeptoResponse {
  data: DeptoForeign[];
  error: ErrorBackend;
}

export interface searchDeptoProps {
  search: string;
}
export const searchDepto = async (
  searchProps: searchDeptoProps
): Promise<searchDeptoResponse> => {
  try {
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
  data: MunicipioForeign[];
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
