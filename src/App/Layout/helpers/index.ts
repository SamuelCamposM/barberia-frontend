import { clienteAxios } from "../../../api";

export const getPages = async () => {
  const res = await clienteAxios.get("/pages");
  return res;
};
