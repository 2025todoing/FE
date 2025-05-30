import axios from './axio';
const API_BASE = import.meta.env.VITE_BACKEND;

export const login = (username, password) => {
  console.log("👉 로그인 요청 보냄:", username, password);
  return axios.post(`/api/users/login`, { email: username, password });
};

export const signup = (email, password, name) => {
  return axios.post('/api/users/signup', { name, email, password });
};