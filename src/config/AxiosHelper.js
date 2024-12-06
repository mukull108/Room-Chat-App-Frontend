import axios from 'axios';

export const baseURL= "room-chat-app-backend-production.up.railway.app";
export const httpClient=axios.create({
    baseURL:baseURL,
});