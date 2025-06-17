import axios from './axio'; 

// 친구 목록 조회 
export const getfriends = async (accessToken) => {
    const response = await axios.get('/api/friends', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};

// email로 친구 추가하기
export const addFriends = async (friendEmail, accessToken) => {
    const response = await axios.post('/api/friends', {
        friendEmail },
        {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });
    return response.data
};

// 특정 친구의 Todo 조회 - friendId로 조회
export const getFriendTodos  = async (friendId, accessToken) => {
    const response = await axios.get(`/api/friends/${friendId}/todos`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });
    return response.data;
};

// 친구 차단하기
export const blockFriend = async (friendId, accessToken) => {
    const response = await axios.post(
        `/api/friends/${friendId}/block`,
        {},
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        }
    );
    return response.data;
  };

// 친구 삭제하기
export const deleteFriend = async (friendId, accessToken) => {
    const response = await axios.delete(
        `/api/friends/${friendId}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );
    return response.data;
  };



/*

// 친구 목록 조회
export const getFriends = async (accessToken) => {
    const response = await axios.get('/api/friends', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};

// 특정 친구의 Todo 조회
export const getFriendTodos = async (friendEmail, accessToken) => {
    const response = await axios.get(`/api/friends/${friendEmail}/todos`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};
*/