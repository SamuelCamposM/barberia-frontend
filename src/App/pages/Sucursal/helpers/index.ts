import { clienteAxios } from "../../../../api";
import { Column, Pagination } from "../../../../interfaces/global";
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
  },
  {
    campo: "depto.name",
    label: "Municipio",
    minWidth: 175,
    sortable: true,
  },
  { campo: "name", label: "Sucursal", minWidth: 175, sortable: true },
  { campo: "tel", label: "tel", minWidth: 100, sortable: true },
  { campo: "direccion", label: "direccion", minWidth: 200, sortable: true },
];

export const sortDefault = { asc: true, campo: "municipio" };

export const rowDefault: SucursalItem = {
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
  error: boolean;
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
      error: false,
      result: { docs, limit, page, totalDocs, totalPages },
    };
  } catch (error) {
    return { error: true, result: { docs: [], ...paginationDefault } };
  }
};

// Define la estructura de la respuesta
interface searchDeptoResponse {
  data: DeptoSuc[];
  error: boolean;
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
    return res;
  } catch (error) {
    console.log({ error });

    toast.error("Hubo un error al consultar los departamentos");
    return { data: [], error: true };
  }
};

// Define la estructura de la respuesta
interface searchMunicipioResponse {
  data: MunicipioSuc[];
  error: boolean;
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
    // return { data: [], error: true };
    return res;
  } catch (error) {
    toast.error("Hubo un error al consultar los municipios");
    return { data: [], error: true };
  }
};
