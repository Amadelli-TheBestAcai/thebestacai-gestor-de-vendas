import axios from "axios";

const API_URL = "https://hml-authenticator-api.herokuapp.com";

console.log(API_URL);

const api = axios.create({
  baseURL: API_URL,
  responseType: "json",
});

export default api;
