import axios from "axios";

import { useCaseFactory } from "../usecases/useCaseFactory";
import { findOrCreate } from "../usecases/ifood";
import { IfoodDto } from "../models/gestor";

const api = axios.create({
  baseURL: "https://merchant-api.ifood.com.br",
  responseType: "json",
});

api.interceptors.request.use(async (config) => {
  const { response: ifood } = await useCaseFactory.execute<IfoodDto>(
    findOrCreate
  );

  if (ifood?.token) {
    //@ts-ignore
    config.headers.Authorization = `Bearer ${ifood.token}`;
  }
  return config;
});

export default api;
