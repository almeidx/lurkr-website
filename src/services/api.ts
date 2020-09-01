import axios from 'axios';

const api = axios.create({
  baseURL: 'https://pepe-api.almeidx.me'
});

export default api;
