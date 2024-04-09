import axios from "axios";

import { getEnvVariables } from "../env/getEnvVariables";

export const fileUpload = async (file: File | null) => {
  if (!file) {
    return { url: "", error: false };
  }
  const cloudUlr = getEnvVariables().VITE_cloudUlr;
  const formData = new FormData();
  formData.append("upload_preset", "react-barberia");
  formData.append("file", file);
  try {
    const resp: { data: { url: string } } = await axios.post(
      cloudUlr,
      formData
    );

    return { url: resp.data.url, error: false };
  } catch (error) {
    console.log({ error });

    return { url: "", error: true };
  }
};

export const procesarUploadsArray = (
  arreglo: {
    config: {
      error: string | boolean;
      eliminado: boolean;
      prevUrl: string;
    };
    data: {
      [x: string]: string;
    };
  }[]
) => {
  let resultado: {
    error: boolean;
    eliminados: string[];
    uploadProperties: { [x: string]: string };
  } = {
    error: false,
    eliminados: [],
    uploadProperties: {},
  };

  for (let objeto of arreglo) {
    if (objeto.config.error) {
      resultado.error = true;
    }

    if (objeto.config.eliminado) {
      resultado.eliminados.push(objeto.config.prevUrl);
    }

    resultado.uploadProperties = {
      ...resultado.uploadProperties,
      ...objeto.data,
    };
  }

  return resultado;
};
