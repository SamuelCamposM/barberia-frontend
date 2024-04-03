import { chatApi } from "../../../../api";
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
    const res = await chatApi.post("/depto", { pagination, sort, busqueda });
    console.log(res);

    return { error: false, result: res.data.result };
  } catch (error) {
    return { error: true };
  }
};

export const SocketOnEvent = {
  agregar: "cliente:depto-agregar",
  editar: "cliente:depto-editar",
  eliminar: "cliente:depto-eliminar",
};
export const SocketEmitEvent = {
  agregar: "server:depto-agregar",
  editar: "server:depto-editar",
  eliminar: "server:depto-eliminar",
};
