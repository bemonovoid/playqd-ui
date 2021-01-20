import axios from 'axios';
export const HTTP_CLIENT = axios.create({
    baseURL: process.env.VUE_APP_BASE_URL
});