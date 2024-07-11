
import { API_URL, ACCESS_TOKEN } from "../constrains";
import axios from "axios";

export const clearJwt = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    window.location.href = "/login";
}
export const isAuthenticated = () => {
    var token = localStorage.getItem(ACCESS_TOKEN)
    return token != null ? true : false;
}
export const getToken = () => {
    return localStorage.getItem(ACCESS_TOKEN);
}
export const setToken = (token) => {
    localStorage.setItem(ACCESS_TOKEN, token);
}

export const getCurrentUser = () => {
    if (!isAuthenticated()) {
        return Promise.reject("No access token set");
    }
    return axios
        .get(API_URL + '/api/info/user', {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            }
        });
}
export const processLogin = (username, password) => {

    console.log(username, password);

    // fetch('http://localhost:8080/api/auth/login', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({ username, password })
    // })

    return axios
        .post(API_URL + '/api/auth/login',
            { username, password },
            {
                headers: {
                    'Content-Type': 'application/json'
                },
            });
}
