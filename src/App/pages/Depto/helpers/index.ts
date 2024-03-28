import { chatApi } from "../../../../api";

export const getDepto = async () => {
  console.log("hola");

  const res = await chatApi.get("/depto");
  return res;
};
