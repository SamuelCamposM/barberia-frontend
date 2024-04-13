import { clienteAxios } from "../../../../api";
import { Column, Pagination } from "../../../../interfaces/global";
import { paginationDefault } from "../../../../helpers/const";
import { DeptoItem, setDataProps } from "../interfaces";
export enum SocketOnDepto {
  agregar = "cliente:depto-agregar",
  editar = "cliente:depto-editar",
  eliminar = "cliente:depto-eliminar",
  municipioListener = "cliente:depto-municipio-listener",
}

export enum SocketEmitDepto {
  agregar = "server:depto-agregar",
  editar = "server:depto-editar",
  eliminar = "server:depto-eliminar",
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
  {
    campo: "totalMunicipios",
    label: "Municipios",
    minWidth: 40,
    sortable: true,
  },
];
export const sortDefault = { asc: true, campo: "name" };

// Definición del objeto por defecto para un nuevo departamento.
export const rowDefault: DeptoItem = {
  name: "",
};
interface Result extends Pagination {
  docs: DeptoItem[];
}

interface MyResponse {
  data: { result: Result };
}

type getDeptosType = ({ busqueda, pagination, sort }: setDataProps) => Promise<{
  error: string;
  result: Result;
}>;

export const getDeptos: getDeptosType = async ({
  busqueda,
  pagination,
  sort,
}: setDataProps) => {
  try {
    const {
      data: {
        result: { docs, limit, page, totalDocs, totalPages },
      },
    }: MyResponse = await clienteAxios.post("/depto", {
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
      error?.response?.data?.error || "Error al consultar los departamentos";

    return { error: msgError, result: { docs: [], ...paginationDefault } };
  }
};
