// Notification.js
import {motion, useAnimate, usePresence} from "framer-motion";
import {useEffect} from "react";


// eslint-disable-next-line react/prop-types
const Notification = ({message,isVisible, onClose}) => {

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 50 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed top-4 right-4 bg-blue-500/20 backdrop-blur-sm text-black p-4 rounded-lg shadow-lg z-50"
            role="alert"
        >
            <div>
                <span>{message}</span>
                <button
                    onClick={onClose}
                    className="ml-4 text-xl font-bold"
                >
                    &times;
                </button>
            </div>

        </motion.div>
    );
};

export default Notification;
