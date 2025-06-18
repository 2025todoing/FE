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

export const sendChatMessage = async (prompt, token) => {
  const response = await axios.post('/chat/message', { prompt }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
  });
  
    return response.data; // { isSuccess, code, message, result }
  };
