import axios from "axios";
import userModel from "../models/user";
import env from "./env.json";
const API_URL = env.API_AUTH;

const api = axios.create({
  baseURL: API_URL,
  responseType: "json",
});

api.interceptors.request.use(async (config) => {
  const user = await userModel.get();
  if (user?.token) {
    //@ts-ignore
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;
