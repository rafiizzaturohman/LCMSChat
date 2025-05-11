import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3002",
  withCredentials: true,
});

export const loginUser = async (email: string, password: string) => {
  const response = await API.post("/auth/login", { email, password });
  return response.data;
};
