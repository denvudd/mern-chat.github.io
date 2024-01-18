import axios from "axios";

const instance = axios.create({
  baseURL: `${process.env.PUBLIC_BACKEND}/api`,
  withCredentials: true,
});

export default instance;
