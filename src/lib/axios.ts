import axios from "axios";

const instance = axios.create({
  baseURL: process.env.PUBLIC_BACKEND,
  withCredentials: true,
});

export default instance;
