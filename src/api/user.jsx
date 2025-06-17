import axios from './axio';

export const fetchMyInfo = async (accessToken) => {
    const response = await axios.get('/api/users/me', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};