import axios from "axios";

export const BASE_URL = "http://localhost:4000";
export const clientServer = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});