import { clienteAxios } from "../../../../../../api";
import { Column, Pagination } from "../../../../../../interfaces/global";
import { paginationDefault } from "../../../../../../helpers";
import { Municipio, setDataProps } from "../interfaces";
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
  { campo: "name", label: "Nombre", minWidth: 40, sortable: true },
];
export const rowDefault: Municipio = {
  depto: "",
  name: "",
};

interface Result extends Pagination {
  docs: Municipio[];
}

interface MyResponse {
  data: { result: Result };
}

type getMunicipiosType = ({
  busqueda,
  depto,
  pagination,
  sort,
}: setDataProps) => Promise<{
  error: string;
  result: Result;
}>;

export const getMunicipios: getMunicipiosType = async ({
  busqueda,
  depto,
  pagination,
  sort,
}: setDataProps) => {
  try {
    const data: MyResponse = await clienteAxios.post("/municipio", {
      pagination,
      sort,
      busqueda,
      depto,
    });

    return { error: "", result: data.data.result };
  } catch (error: any) {
    const msgError =
      error?.response?.data?.error || "Error al consultar los departamentos";

    return { error: msgError, result: { docs: [], ...paginationDefault } };
  }
};
