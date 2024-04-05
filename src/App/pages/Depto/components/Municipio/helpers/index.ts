import { chatApi } from "../../../../../../api";
import { Pagination } from "../../../../../../interfaces/global";
import { paginationDefault } from "../../../../../../helpers";
import { Municipio, setDataProps } from "../interfaces";

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
  error: boolean;
  result: Result;
}>;

export const getMunicipios: getMunicipiosType = async ({
  busqueda,
  depto,
  pagination,
  sort,
}: setDataProps) => {
  try {
    const data: MyResponse = await chatApi.post("/municipio", {
      pagination,
      sort,
      busqueda,
      depto,
    });

    return { error: false, result: data.data.result };
  } catch (error) {
    return { error: true, result: { docs: [], ...paginationDefault } };
  }
};

export const SocketOnMunicipio = {
  agregar: "cliente:municipio-agregar",
  editar: "cliente:municipio-editar",
  eliminar: "cliente:municipio-eliminar",
};
export const SocketEmitMunicipio = {
  agregar: "server:municipio-agregar",
  editar: "server:municipio-editar",
  eliminar: "server:municipio-eliminar",
};
