import axios from "axios";
import userModel from "../models/user";

const API_URL = "https://hml-thebestacai-api.herokuapp.com";

console.log(API_URL);
const api = axios.create({
  baseURL: API_URL,
  responseType: "json",
});

api.interceptors.request.use(async (config) => {
  const token = userModel.loggedUser;
  if (token) {
    //@ts-ignore
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
