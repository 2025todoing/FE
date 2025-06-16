import axios from './axio';
const API_BASE = import.meta.env.VITE_BACKEND;

export const createTodo = (payload, token) => {
    console.log("투두 생성 요청 보내기기")
    return axios.post('/api/todos', payload, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
};

export const toggleTodo = async (todoId, accessToken) => {
    const response = await axios.put(`/api/todos/${todoId}/toggle`, null, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
  };

export const updateTodo = async (todoId, data, accessToken) => {
    const response = await axios.put(`/api/todos/${todoId}`, data, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });
    return response.data;
  };

export const fetchTodosByDate = async (date, accessToken) => {
    const response = await axios.get(`/api/todos`, {
        params: { date },
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
  };

export const deleteTodo = async (todoId, accessToken) => {
    const response = await axios.delete(`/api/todos/${todoId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data; // { isSuccess, code, message, result }
};