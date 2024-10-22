import axios, { AxiosInstance } from "axios";

export const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:3001",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});
