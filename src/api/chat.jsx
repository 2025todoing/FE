import axios from './axio';

export const sendChatSetting = async (settingData, token) => {
  const response = await axios.post('/chat/setting', settingData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data; // { isSuccess, code, message, result }
};

export const sendChatMessage = async (messages, token) => {
  const response = await axios.post('/chat/message', { messages }, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data; // { isSuccess, code, message, result }
};
export const saveChatPlan = async (planData, token) => {
  const response = await axios.post('/api/todos/chat', planData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data; // { isSuccess, code, message, result }
};
