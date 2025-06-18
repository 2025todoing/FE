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
