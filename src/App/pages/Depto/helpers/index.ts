import { chatApi } from "../../../../api";
import { Pagination } from "../../../../interfaces/global";

export const getDepto = async (pagination: Pagination, busqueda: string) => {
  try {
    const res = await chatApi.post("/depto", { pagination, busqueda });
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
