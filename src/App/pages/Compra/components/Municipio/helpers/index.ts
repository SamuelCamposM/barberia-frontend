import { clienteAxios } from "../../../../../../api";
import {
  Column,
  ErrorBackend,
  Pagination,
} from "../../../../../../interfaces/global";
import { paginationDefault } from "../../../../../../helpers";
import { MunicipioItem, setDataProps } from "../interfaces";
export enum SocketOnMunicipio {
  agregar = "cliente:municipio-agregar",
  editar = "cliente:municipio-editar",
  eliminar = "cliente:municipio-eliminar",
}

export enum SocketEmitMunicipio {
  agregar = "server:municipio-agregar",
  editar = "server:municipio-editar",
  eliminar = "server:municipio-eliminar",
}

export const columns: Column[] = [
  { campo: "", label: "", minWidth: 50, align: "center", sortable: false },
  {
    campo: "name",
    label: "Nombre",
    required: true,
    minWidth: 40,
    sortable: true,
  },
];
export const itemDefault: MunicipioItem = {
  compra: "",
  name: "",
};

interface Result extends Pagination {
  docs: MunicipioItem[];
}

interface MyResponse {
  data: { result: Result };
}

type getMunicipiosType = (arg: setDataProps) => Promise<{
  error: ErrorBackend;
  result: Result;
}>;

export const getMunicipios: getMunicipiosType = async ({
  busqueda,
  compra,
  pagination,
  sort,
}: setDataProps) => {
  try {
    const data: MyResponse = await clienteAxios.post("/municipio", {
      pagination,
      sort,
      busqueda,
      compra,
    });

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
