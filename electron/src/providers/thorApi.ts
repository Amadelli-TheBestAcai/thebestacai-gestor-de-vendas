import axios from "axios";
import env from "./env.json";

import { useCaseFactory } from "../usecases/useCaseFactory";
import { getUser } from "../usecases/user";
import { UserDto } from "../models/gestor";

const API_THOR = env.API_THOR;

const api = axios.create({
  baseURL: API_THOR,
  responseType: "json",
});

api.interceptors.request.use(async (config) => {
  const { response: user } = await useCaseFactory.execute<UserDto>(getUser);

  if (user?.token) {
    //@ts-ignore
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;
