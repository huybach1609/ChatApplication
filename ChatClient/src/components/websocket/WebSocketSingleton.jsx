import axios from 'axios';

class WebSocketSingleton {
    static instance = null;
    socket = null;

    static getInstance() {
        if (!WebSocketSingleton.instance) {
            WebSocketSingleton.instance = new WebSocketSingleton();
        }
        return WebSocketSingleton.instance;
    }

    async connect(url, userId, token) {
        if (this.socket) {
            console.log("WebSocket already connected");
            return;
        }

        const hostWebSocket = await this.getHostWebSocket(url, token);
        if (hostWebSocket == null) {
            console.error('Error fetching WebSocket host info:');
            return;
        }

        this.socket = new WebSocket(`ws://${hostWebSocket}/ws?userId=${userId}`);

        this.socket.onopen = () => {
            console.log('Connected');
        };
        this.socket.onmessage = (event) => {
            console.log('Received: ' + event.data);
        };
        this.socket.onclose = () => {
            console.log('Disconnected');
            this.socket = null; // Reset socket on close
        };
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
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

export default WebSocketSingleton;
