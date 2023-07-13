import axios from "axios";

const API_URL = window.Main.env.API_S3;

const api = axios.create({
  baseURL: API_URL,
  responseType: "json",
});

api.interceptors.request.use(async (config) => {
  const { response: user } = await window.Main.user.getUser();

  if (user?.token) {
    //@ts-ignore
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;
