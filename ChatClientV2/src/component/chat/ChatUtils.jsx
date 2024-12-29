
// fetch message
import {API_URL} from "../../../Constains.jsx";
import axios from "axios";
import {getToken, getUserId} from "../auth/ApiUtils.jsx";

export const loadMessage = async (target, numberOfMess) => {
    try {
        const response = await axios
            .get(API_URL + `/api/message/${getUserId()}/${target}?number=${numberOfMess}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                }
            });
        return response.data
    } catch (error) {
        console.error('Error fetching WebSocket host info:', error);
        return null;
    }
}
export const loadListMessageById = async (messageId, numberOfMess) => {
    try {
        const response = await axios
            .get(API_URL + `/api/message?messageId=${messageId}&limit=${numberOfMess}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                }
            });
        return response.data;
    } catch (error) {
        throw error;
    }
}

