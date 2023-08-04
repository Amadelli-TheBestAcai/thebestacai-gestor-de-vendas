import axios from "axios";

const api = axios.create({
  baseURL: "https://merchant-api.ifood.com.br",
  responseType: "json",
});

export default api;
