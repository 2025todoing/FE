import axios from 'axios';

// .env에서 설정한 주소를 불러옴
const API_BASE = import.meta.env.VITE_BACKEND;

// axiosInstance라는 "특수한 axios 객체"를 하나 만듦
const axiosInstance = axios.create({
  baseURL: API_BASE, // 모든 요청은 이 주소로 시작함
  timeout: 5000,     // 응답을 5초 이상 기다리지 않음
  headers: {
    'Content-Type': 'application/json' // 모든 요청은 JSON 형식으로 보냄
  }
});

export default axiosInstance;
