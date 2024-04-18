import { clienteAxios } from "../../../../api";
import { Column, Pagination } from "../../../../interfaces/global";
import { paginationDefault } from "../../../../helpers/const";
import {
  DeptoSuc,
  MunicipioSuc,
  UsuarioItem,
  setDataProps,
} from "../interfaces";
import { toast } from "react-toastify";
export enum SocketOnUsuario {
  agregar = "cliente:usuario-agregar",
  editar = "cliente:usuario-editar",
  eliminar = "cliente:usuario-eliminar",
}

export enum SocketEmitUsuario {
  agregar = "server:usuario-agregar",
  editar = "server:usuario-editar",
  eliminar = "server:usuario-eliminar",
}

export const columns: Column[] = [
  { campo: "", label: "", minWidth: 10, align: "center", sortable: false },
  {
    campo: "online",
    label: "",
    align: "center",
    minWidth: 25,
    sortable: true,
    required: false,
  }, 
  {
    campo: "lastname",
    label: "Nombre Completo",
    minWidth: 175,
    sortable: true,
    required: false,
  },
  {
    campo: "email",
    label: "Email",
    minWidth: 175,
    sortable: false,
    required: false,
  },

  {
    campo: "tel",
    label: "tel",
    minWidth: 175,
    sortable: false,
    required: false,
  },
  {
    campo: "createdAt",
    label: "Fec. Reg.",
    minWidth: 175,
    sortable: true,
    required: false,
  },
];

export const sortDefault = { asc: false, campo: "online" };

export const rowDefault: UsuarioItem = {
  email: "",
  lastname: "",
  name: "",
  online: false,
  photo: "",
  tel: "",
  rol: "CLIENTE",
  estado: true,
  createdAt: new Date().toString(),
  updatedAt: "",
};
interface Result extends Pagination {
  docs: UsuarioItem[];
}

interface MyResponse {
  data: { result: Result };
}

type getUsuariosType = ({
  busqueda,
  pagination,
  sort,
}: setDataProps) => Promise<{
  error: string;
  result: Result;
}>;

export const getUsuarios: getUsuariosType = async ({
  busqueda,
  pagination,
  sort,
}: setDataProps) => {
  try {
    const {
      data: {
        result: { docs, limit, page, totalDocs, totalPages },
      },
    }: MyResponse = await clienteAxios.post("/usuario", {
      pagination,
      sort,
      busqueda,
    });

    return {
      error: "",
      result: { docs, limit, page, totalDocs, totalPages },
    };
  } catch (error: any) {
    const msgError =
      error?.response?.data?.error || "Error al consultar las usuarios";

    return { error: msgError, result: { docs: [], ...paginationDefault } };
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
    if (res.data.length === 0) {
      toast.error("No se encontraron departamentos");
    }
    return res;
  } catch (error: any) {
    const msgError =
      error?.response?.data?.error || "Error al consultar los departamentos";
    toast.error(msgError);
    return { error: msgError, data: [] };
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
    if (res.data.length === 0) {
      toast.error("No se encontraron municipios");
    }
    return res;
  } catch (error: any) {
    console.log(error);

    const msgError =
      error?.response?.data?.error || "Error al consultar los municipios";
    toast.error(msgError);
    return { error: msgError, data: [] };
  }
};
