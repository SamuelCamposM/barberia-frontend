import { clienteAxios } from "../../../api";
import { ErrorBackend } from "../../../interfaces/global";
import { PageItem } from "../../pages/Menu";

interface MyResponse {
  data: { data: PageItem[] };
}

type getDeptosType = () => Promise<{
  error: ErrorBackend;
  data: PageItem[];
}>;

export const getPages: getDeptosType = async () => {
  try {
    const res: MyResponse = await clienteAxios.get("/pages");
    console.log({ res });

    return {
      data: res.data.data,
      error: { msg: "", error: false },
    };
  } catch (error: any) {
    console.log({ error });

    const errorResult = {
      msg: error?.response?.data?.msg || "Error al consultar modulos",
      error: true,
    };

    return { error: errorResult, data: [] };
  }
};
