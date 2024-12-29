import axios from "axios";
import SockJS from "sockjs-client";
import {Client} from '@stomp/stompjs';

class StompSingleton {
    stompClient = null;
    callbacks = {};

    static instance = null;

    static getInstance() {
        if (!StompSingleton.instance) {
            StompSingleton.instance = new StompSingleton();
        }
        return StompSingleton.instance;
    }

    async connect(url, userId, token, onConnect) {
        if (this.stompClient) {
            console.log("Stomp already connected");
            return;
        }

        const hostWebSocket = await this.getHostWebSocket(url, token);
        if (hostWebSocket == null) {
            console.log('Error fetching WebSocket host info');
            return;
        }

        let socket = new SockJS(`http://${hostWebSocket}/websocket`);
        this.stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            connectHeaders:{
               userId: userId
            },
            onConnect: (frame)=>{
                console.log("Connected to WebSocket "+ frame);
                onConnect();
            },
            onStompError: (frame) => {
                console.error("STOMP error:", frame.headers['message'], frame.body);
            },
        });
        this.stompClient.activate();
    }

    subscribeTopic(topic, callback) {

        if (this.stompClient && this.stompClient.connected) {
            this.callbacks[topic] = callback; // store callback

            this.stompClient.subscribe(topic, (message) => {
                if (this.callbacks[topic]) {
                    this.callbacks[topic](message);
                }
            });
            console.log(`Subscribed to ${topic}`);
        } else {
            console.error('STOMP client is not connected');
        }
    }

    updateCallback(topic, newCallback) {
        if (this.callbacks[topic]) {
            this.callbacks[topic] = newCallback;
            console.log(`Updated callback for ${topic}`);
        } else {
            console.log(`StompSingleton:non callback for ${topic}`);
        }
    }
    disconnect() {
        if (this.stompClient) {
            this.stompClient.deactivate();
            this.stompClient = null;
        }
    }

    async getHostWebSocket(url, token) {
        try {
            const response = await axios.get(url + '/api/ws/info', {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching WebSocket host info:', error);
            return null;
        }
    }
}

export default StompSingleton;