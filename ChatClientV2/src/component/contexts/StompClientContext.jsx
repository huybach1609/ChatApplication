import {createContext, useContext, useEffect, useState} from "react";
import {getToken, getUserId, isAuthenticated} from "../auth/ApiUtils.jsx";
import StompSingleton from "../../websocket/StompSingleton.jsx";

export const StompClientContext = createContext(null);
// eslint-disable-next-line react-refresh/only-export-components
export const useStompClient = () => useContext(StompClientContext);

// eslint-disable-next-line react/prop-types
export const StompClientProvider = ({children, url}) => {
    const [stompClient, setStompClient] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const stompClientInstance = StompSingleton.getInstance();

        const handleConnect =() =>{
            const publicUrl = '/chatroom/public';
            const privateUrl = `/user/${getUserId()}/private`;

            console.log("privateUrl: " + privateUrl);
            subscribeTopic(publicUrl, notiSubcribe);
            subscribeTopic(privateUrl, notiSubcribe);

            setIsConnected(true); // Set connection status
        }

        const connectStomp = async ()=>{
           await stompClientInstance.connect(url, getUserId(), getToken(), handleConnect );
           setStompClient(stompClientInstance.stompClient)
        }

        if (!stompClientInstance.stompClient && isAuthenticated()) {
            connectStomp();
        } else if(stompClientInstance.stompClient){
            handleConnect();
        }
        return () => {
            stompClientInstance.disconnect();
            setStompClient(null);
            setIsConnected(false);
        }
    }, [url]);

    const subscribeTopic = (topic, callback) => {
        StompSingleton.getInstance().subscribeTopic(topic, callback);
    }
    const updateSubscriptionCallback = (topic, newCallback) => {
        StompSingleton.getInstance().updateCallback(topic, newCallback);
    };
    const notiSubcribe = () => {
        // console.log(`Subscribed`);
    }

    return (
        <StompClientContext.Provider value={{stompClient, updateSubscriptionCallback, isConnected}}>
            {children}
        </StompClientContext.Provider>

    );
}

