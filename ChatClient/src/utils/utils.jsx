
import { CarTaxiFront } from "lucide-react";
import { API_URL, ACCESS_TOKEN } from "../constrains";
import axios from "axios";

// adjust token / jwt
export const clearJwt = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    window.location.href = "/login";
}
export const getToken = () => {
    return localStorage.getItem(ACCESS_TOKEN);
}
export const setToken = (token) => {
    localStorage.setItem(ACCESS_TOKEN, token);
}
export const isAuthenticated = () => {
    var token = localStorage.getItem(ACCESS_TOKEN)
    return token != null ? true : false;
}

// user api 
export const getCurrentUser = () => {
    if (!isAuthenticated()) {
        return Promise.reject("No access token set");
    }
    return axios
        .get(API_URL + '/api/user', {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            }
        });
}
export const setUserId = (value) => {
    localStorage.setItem("uid", value);
}
export const getUserId = () => {
    var id = localStorage.getItem("uid");
    return id;
}
// auth
export const processLogin = (username, password) => {

    console.log(username, password);
    return axios
        .post(API_URL + '/api/auth/login',
            { username, password },
            {
                headers: {
                    'Content-Type': 'application/json'
                },
            });
}

// get list friend 
export const getListFriend = async () => {
    try {
        const response = await axios
            .get(API_URL + '/api/friendship', {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                }
            });
        return response.data;
    }
    catch (error) {
        console.error('Error fetching WebSocket host info:', error);
        return null;
    }
}
export const loadMessage = async ( target , numberOfMess) => {
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

// set currentTarget 
export const setTarget = (user) => {
    localStorage.setItem("target", user);
}

export const getTarget = () => {
    return localStorage.getItem("target");
}
export const removeTarget = () => {
    return localStorage.removeItem("target");
}
// set currentTarget 
export const setUserLog = (user) => {
    localStorage.setItem("user", user);
}

export const getUser = () => {
    return localStorage.getItem("user");
}
export const removeUser = () => {
    return localStorage.removeItem("user");
}