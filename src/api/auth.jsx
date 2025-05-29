import axios from './axio';

export const login = (username, password) => {
    return axios.post('/api/login', { username, password });
  };
  

export const signup = (email, password, nickname) => {
    return axios.post('/api/signup', { email, password, nickname });
  };