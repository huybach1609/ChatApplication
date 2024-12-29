import {createContext, useContext, useState} from "react";
import Notification from "../components/default/Notification.jsx";
import {AnimatePresence} from "framer-motion";
import Component from "../components/Component.jsx";

export const AppContext = createContext(null);

// eslint-disable-next-line react-hooks/rules-of-hooks
export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({children}) => {
    // const [notificationVisible, setNotificationVisible] = useState(false);
    const [notification, setNotification] = useState({
        message: '',
        isVisible: false,
    });

    const showNotification = (message) => {
        setNotification({
            isVisible: true,
            message: message
        });
        setTimeout(() => setNotification({
            isVisible: false,
            message: ''
        }), 3000); // Hide after 3 seconds
    };

    return (
        <AppContext.Provider value={{showNotification}}>
                    <Notification
                        key="dialog"
                        message={notification.message}
                        isVisible={notification.isVisible}
                        onClose={() => setNotification({isVisible: false})}
                    />
            {children}
        </AppContext.Provider>

    );
}