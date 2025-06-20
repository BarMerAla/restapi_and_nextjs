import axios from "axios";

export const API_BASE_URL =  "http://127.0.0.1:8000";

export const api = axios.create({
    baseURL: API_BASE_URL,
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});