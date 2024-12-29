import { createContext, useContext, useEffect } from "react";
import { useState } from "react";
import { getToken, getUserId, isAuthenticated } from "../utils/utils.jsx";
import WebSocketSingleton from "../components/websocket/WebSocketSingleton.jsx";


export const WebsocketContext = createContext(null);

export const useWebSocket = () => useContext(WebsocketContext);

// eslint-disable-next-line react/prop-types
export const WebSocketProvider = ({ children, url }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {

        const webSocketInstance = WebSocketSingleton.getInstance();
        const connect = async () => {
            await webSocketInstance.connect(url, getUserId(), getToken());
            setSocket(webSocketInstance.socket);
        }
        if (!webSocketInstance.socket && isAuthenticated()) {
            connect();
        } else {
            setSocket(webSocketInstance.socket);
        }
        return () => {
            webSocketInstance.disconnect();
        }
    }, [url]);

    const setOnMessage = (handler) => {
        if (socket) {
            socket.onmessage = handler;
        }
    };

    // const connect = async () => {
    //     await webSocketInstance.connect(url, getUserId(), getToken());
    //     setSocket(webSocketInstance.socket);
    // }
    // const disconnect = () => {
    //     const webSocketInstance = WebSocketSingleton.getInstance();
    //     webSocketInstance.disconnect();
    // }

    return (
        <WebsocketContext.Provider value={{ socket, setOnMessage }}>
            {children}
        </WebsocketContext.Provider>
    );

    // if (!socket) {
    //     console.log("webSocketContext: connect ws");
    //     connect(getUserId());
    //     console.log(url);
    // }
    // return () => {
    //     connect.log("webSocketContext: disconnect");
    //     disconnect();
    // }
    // const connect = async (userId) => {
    //     const hostWebSocket = await getHostWebShocket();
    //     if (hostWebSocket == null) {
    //         console.error('Error fetching WebSocket host info:');
    //         return;
    //     }
    //     const newSocket = new WebSocket(`ws://${hostWebSocket}/ws?userId=${userId}`);
    //     newSocket.onopen = () => {
    //         console.log('Connected');
    //     };
    //     newSocket.onmessage = (event) => {
    //         console.log('Received: ' + event.data);
    //     };
    //     newSocket.onclose = () => {
    //         console.log('Disconnected');
    //     };
    //     console.log("It go here");
    //     setSocket(newSocket);
    // };

    // const disconnect = () => {
    //     if (socket != null) {
    //         socket.close();
    //         setSocket(null);
    //     }
    // };

    // const getHostWebShocket = async () => {
    //     try {
    //         const response = await axios
    //             .get(API_URL + '/api/ws/info', {
    //                 headers: {
    //                     Authorization: `Bearer ${getToken()}`,
    //                 }
    //             });
    //         return response.data;
    //     } catch (error) {
    //         console.error('Error fetching WebSocket host info:', error);
    //         return null;
    //     }
    // }

};

