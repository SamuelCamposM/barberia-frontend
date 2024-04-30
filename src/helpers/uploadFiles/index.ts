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

// MULTIPLES

export interface FileData {
  name: string;
  file: File;
}
export interface NuevoDoc {
  name: string;
  urlTemp: string;
}
export interface PhotoData {
  eliminados: string[];
  newsToShow: NuevoDoc[];
  antiguos: string[];
  newFiles: FileData[];
}
export function processObject(obj: { [x: string]: PhotoData }) {
  let values: { [key: string]: string[] } = {};
  let eliminados: string[] = [];

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      // let antiguosFiltrados = obj[key].antiguos.filter(
      //   (url) => !obj[key].eliminados.includes(url)
      // );
      let antiguos = obj[key].antiguos;
      let newsToShowNames = obj[key].newsToShow.map((item) => item.name);
      values[key] = [...antiguos, ...newsToShowNames];
      eliminados = [...eliminados, ...obj[key].eliminados];
    }
  }

  console.log({
    values: values,
    eliminados: eliminados,
  });

  return {
    values: values,
    eliminados: eliminados,
  };
}
export const uploadAllFiles = async (obj: { [x: string]: PhotoData }) => {
  let error = false;
  const values: { [x: string]: string[] } = {}; // Add an index signature

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const element = obj[key];
      const newFiles = element.newFiles;

      const urls = [];
      for (let i = 0; i < newFiles.length; i++) {
        const fileObj = newFiles[i];
        const file = fileObj.file;

        const uploadResult = await fileUpload(file);
        if (uploadResult.error) {
          error = true;
        } else {
          urls.push(uploadResult.url);
        }
      }

      values[key] = [...urls, ...obj[key].antiguos];
    }
  }

  return { error, values };
};
