import axios from 'axios';

export const baseURL= "https://localhost:8080";
export const httpClient=axios.create({
    baseURL:baseURL,
});