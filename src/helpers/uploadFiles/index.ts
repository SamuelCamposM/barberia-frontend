import axios from "axios";

import { getEnvVariables } from "../env/getEnvVariables";
import { Photo } from "../../interfaces/global";

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
      eliminado: boolean | undefined;
      prevUrl: string;
    };
    [x: string]: string;
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
      ...objeto,
    };
  }

  return resultado;
};
export const procesarDocsValuesUpload = (
  fotos: {
    [x: string]: {
      image: {
        url: string;
        eliminado?: boolean | undefined;
        antiguo?: string | undefined;
      };
      error: string | boolean;
    };
  }[]
) => {
  let error: string | boolean = false;
  let uploadProperties: { [key: string]: string } = {};

  fotos.forEach((foto) => {
    // Obtenemos la clave y el valor del objeto
    let clave = Object.keys(foto)[0];
    let valor = foto[clave];

    if (valor.error) {
      // Si la foto tiene un error, marcamos error como true
      error = error;
    }
    // Agregamos la url de la foto a los valores

    uploadProperties[clave] = valor.image.url;
  });

  return {
    error: error,
    uploadProperties: uploadProperties,
  };
};

export const procesarDocsValues = (fotos: { [key: string]: Photo }[]) => {
  let eliminados: string[] = [];
  let values: { [key: string]: string } = {};

  fotos.forEach((foto) => {
    // Obtenemos la clave y el valor del objeto
    let clave = Object.keys(foto)[0];
    let valor = foto[clave];

    if (valor.eliminado) {
      // Si la foto está eliminada, la agregamos a la lista de eliminados
      console.log(valor.antiguo);
      
      eliminados.push(valor.antiguo || "");
      // Si hay un nuevo url, lo asignamos a values
      values[clave] = valor.url !== valor.antiguo ? valor.url : "";
    } else {
      // Si no está eliminada, la agregamos a los valores
      values[clave] = valor.url;
    }
  });

  return {
    eliminados: eliminados,
    values: values,
  };
};
