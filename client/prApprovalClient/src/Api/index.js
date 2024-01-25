import axios from "axios";

const API = axios.create({
  baseURL: "https://pr-approval-system-api.vercel.app",
});

API.interceptors.request.use((req) => {
  if (localStorage.getItem("token")) {
    req.headers.authorization = `Bearer ${JSON.parse(
      localStorage.getItem("token")
    )}`;
  }
  return req;
});

export default API;
