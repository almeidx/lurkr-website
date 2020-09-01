import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.pepe-is.life'
});

export default api;
