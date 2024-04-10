import { clienteAxios } from "../../../../api";
import { Column, Pagination } from "../../../../interfaces/global";
import { paginationDefault } from "../../../../helpers/const";
import { DeptoItem, setDataProps } from "../interfaces";

export const SocketOnDepto = {
  agregar: "cliente:depto-agregar",
  editar: "cliente:depto-editar",
  eliminar: "cliente:depto-eliminar",
  municipioListener: "cliente:depto-municipio-listener",
};
export const SocketEmitDepto = {
  agregar: "server:depto-agregar",
  editar: "server:depto-editar",
  eliminar: "server:depto-eliminar",
};

export const columns: Column[] = [
  { campo: "", label: "", minWidth: 50, align: "center", sortable: false },
  { campo: "name", label: "Nombre", minWidth: 40, sortable: true },
  {
    campo: "totalMunicipios",
    label: "Municipios",
    minWidth: 40,
    sortable: true,
  },
]; // Definición del objeto por defecto para un nuevo departamento.
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
  error: boolean;
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
      error: false,
      result: { docs, limit, page, totalDocs, totalPages },
    };
  } catch (error) {
    return { error: true, result: { docs: [], ...paginationDefault } };
  }
};
