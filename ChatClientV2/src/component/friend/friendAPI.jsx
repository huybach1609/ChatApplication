// get list friend
import axios from "axios";
import {getToken, getUserId} from "../auth/ApiUtils.jsx";
import {API_URL} from "../../../Constains.jsx";

export const getInfoUser = async (username) => {
    const response = await axios.get(API_URL + `/api/user/username/${username}`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        }
    });
    return response.data;
};

export const getListFriend = async () => {
    try {
        const response = await axios
            .get(API_URL + '/api/friendship/list', {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                }
            });
        return response.data;
    } catch (error) {
        console.error('Error fetching WebSocket host info:', error);
        return null;
    }
}
// get list friend
//{{api-gateway}}/api/friendship/isFriend?userId=38683e47-5379-35e4-8dac-464d643a0073&friendId=200d5354-9fb3-33f6-8e52-35d726ed77cb
export const isFriend = async (userId, friendId) => {
    try {
        const response = await axios
            .get(API_URL + `/api/friendship/isFriend?userId=${userId}&friendId=${friendId}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                }
            });
        return response.data;
    } catch (error) {
        console.error('Error fetching WebSocket host info:', error);
        return null;
    }
}
// http://localhost:8080/api/friendship/ACCEPTED?sender=38683e47-5379-35e4-8dac-464d643a0073
export const getListFriendRequest = async () => {
    try {
        const response = await axios
            .get(API_URL + `/api/friendship/list/PENDING?sender=${getUserId()}&type=address`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                }
            });
        return response.data;
    } catch (error) {
        console.error('Error fetching WebSocket host info:', error);
        return null;
    }
}

export const getListBlockedFriendRequest = async () => {
    try {
        const response = await axios
            .get(API_URL + `/api/friendship/list/BLOCKED?sender=${getUserId()}&type=request`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                }
            });
        return response.data;
    } catch (error) {
        console.error('Error fetching WebSocket host info:', error);
        return null;
    }
}
// friendship/action/block?requestId=&addressId=
// type  block, type  unblock
export const blockFriend = async (addressId, type) => {
    try {
        const response = await axios
            .put(API_URL + `/api/friendship/action/${type}?requestId=${getUserId()}&addressId=${addressId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    }
                });
        return response.data;
    } catch (error) {
        console.error('Error fetching WebSocket host info:', error);
        return null;
    }
}


// search User by username fullName
export const searchUser = async (key) => {
    try {
        const response = await axios
            .get(API_URL + `/api/user/find?username=${key}&fullName=${key}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                }
            });
        return response.data;
    } catch (error) {
        console.error('Error fetching WebSocket host info:', error);
        return null;
    }
}

//Post: send request friend to target
export const sendRequestFriend = async (data) => {
    try {
        const response = await axios
            .post(API_URL + `/api/friendship/action/send-request`, data, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                }
            });
        return response.data;
    } catch (error) {
        // console.error('Error fetching WebSocket host info:', error);
        console.log(error.response.data.message);
        return error.response.data.message;
    }
}
//Put: send accept friend to target
export const AcceptRequestFriend = async (data) => {
    try {
        const response = await axios
            .put(API_URL + `/api/friendship/action/accept-request`, data, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                }
            });
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
        return error.response;
    }
}

//Delete: send delete friendship to target
// /api/friendship?requestId=?&addressId=
export const deleteFriendShip = async (requestId, addressId) => {
    try {
        const response = await axios
            .delete(API_URL + `/api/friendship?requestId=${requestId}&addressId=${addressId}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                }
            });
        return response.data;
    } catch (error) {
        // console.error('Error fetching WebSocket host info:', error);
        console.log(error.response.data.message);
        return error.response.data.message;
    }
}