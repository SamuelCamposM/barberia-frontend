import { clienteAxios } from "../../../../api";
import { Pagination, Sort } from "../../../../interfaces/global";

export const getDeptos = async ({
  pagination,
  busqueda,
  sort,
}: {
  pagination: Pagination;
  busqueda: string;
  sort: Sort;
}) => {
  try {
    const res = await clienteAxios.post("/depto", { pagination, sort, busqueda });

    return { error: false, result: res.data.result };
  } catch (error) {
    return { error: true };
  }
};

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
