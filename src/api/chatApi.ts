import axios, { AxiosRequestHeaders } from "axios";
import { getEnvVariables, EnvVariables } from "../helpers";

const { VITE_API_URL } = getEnvVariables() as EnvVariables;

const chatApi = axios.create({
  baseURL: VITE_API_URL + "api",
});

//todo: CONFIGURAR INTERCEPTORES
chatApi.interceptors.request.use((config) => {
  config.headers = {
    ...config.headers,
    "x-token": localStorage.getItem("token") || "",
  } as unknown as AxiosRequestHeaders;
  return config;
});

export default chatApi;
