import axios from 'axios';

const api = axios.create({
  baseURL: 'https://144.172.83.34:3333'
})

export default api;
