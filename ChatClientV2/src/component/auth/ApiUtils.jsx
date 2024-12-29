import {ACCESS_TOKEN, API_URL} from "../../../Constains.jsx";
import axios from "axios";

// adjust token / jwt
export const clearJwt = () => {
    localStorage.removeItem(ACCESS_TOKEN);
}
export const getToken = () => {
    return localStorage.getItem(ACCESS_TOKEN);
}
export const setToken = (token) => {
    localStorage.setItem(ACCESS_TOKEN, token);
}
export const isAuthenticated = () => {
    var token = localStorage.getItem(ACCESS_TOKEN)
    return token != null;
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

export const clearUserId = () => {
    localStorage.removeItem("uid");
}

// auth
export const processLogin = (username, password) => {

    console.log(username, password);
    return axios
        .post(API_URL + '/api/auth/login',
            {username, password},
            {
                headers: {
                    'Content-Type': 'application/json'
                },
            });
}



