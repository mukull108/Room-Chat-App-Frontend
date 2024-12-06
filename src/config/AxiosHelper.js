import axios from 'axios';

export const baseURL= "room-chat-app-backend.railway.internal";
export const httpClient=axios.create({
    baseURL:baseURL,
});