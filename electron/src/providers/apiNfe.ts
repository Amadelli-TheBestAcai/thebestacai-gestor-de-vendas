import axios from "axios";
import env from "./env.json";

const api = axios.create({
  baseURL: "http://amazum.com.br/api",
  responseType: "json",
});

api.interceptors.request.use(async (config) => {
  //@ts-ignore
  config.headers.Authorization = `Bearer ${env.NFCe_Token}`;
  return config;
});

export default api;
