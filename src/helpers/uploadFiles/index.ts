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
