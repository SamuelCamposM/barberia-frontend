import { chatApi } from "../../../api";

export const getPages = async () => {
  const res = await chatApi.get("/pages");
  return res;
};
