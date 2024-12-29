import {useCallback, useEffect, useRef, useState} from "react";
import {Button, Divider, Input, makeStyles, Tooltip} from "@fluentui/react-components";
import {Add20Regular, Send20Regular} from "@fluentui/react-icons";
import {loadListMessageById, loadMessage} from "./ChatUtils.jsx";
import {getUserId} from "../auth/ApiUtils.jsx";
import {groupMessagesByDate, guidGenerator, toHour} from "../../utils/DateUtils.jsx";
import {AnimatePresence, motion} from "framer-motion";
import {useStompClient} from "../contexts/StompClientContext.jsx";
import {Message} from "../../entity/Message.js";

const useStyles = makeStyles({
    messageView: {
        width: "100%",
        flexGrow: 1,
        height: "100px",
        overflowY: 'scroll',
        scrollBehavior: "smooth"
    },
    inputView: {
        width: "100%",
        height: "60px",
        display: "flex",
        justifyContent: "center"
    },
    inputMessage: {
        width: "90%",
        height: "40px"
    },
    icon: {
        ":hover": {
            color: "var(--colorNeutralForeground2BrandHover)"
        },
        ":active": {
            color: "var(--colorNeutralForeground2BrandPressed)"
        }
    },
});


// eslint-disable-next-line react/prop-types
export const MessageViewComponent = ({target}) => {
    const classes = useStyles();
    const containerRef = useRef(null);
    const endOfMessagesRef = useRef(null);
    const {stompClient, updateSubscriptionCallback, isConnected} = useStompClient();
    const [messageList, setMessageList] = useState(null);
    const [loading, setLoading] = useState(false);


    useEffect(() => {

        if (stompClient && isConnected) {
            updateSubscriptionCallback("/chatroom/public", onMessageReceived);
            updateSubscriptionCallback(`/user/${getUserId()}/private`, onMessagePrivateReceived);
            console.log(target.fullName + "MessageViewStompComponent: subscribe ");
        }

        return () => {
            console.log("MessageViewComponent: unsubscribing from topics");
            // socket.onmessage = null;
        }
    }, [stompClient, isConnected]);

    const onMessageReceived = (payload) => {
        let payloadData = JSON.parse(payload.body);
        console.log(payloadData);
    };
    const scrollToBottom = () => {
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({behavior: 'smooth'});
        }
    };


    const onMessagePrivateReceived = (payload) => {
        let messDetail = JSON.parse(payload.body);
        console.log(messDetail)
        if (messDetail.type === "DELIVERY") {
            if (target.id === messDetail.sender) {
                var mess = {
                    sender: messDetail.sender,
                    to: messDetail.to,
                    message: messDetail.message,
                    time: messDetail.time,
                    type: messDetail.type
                }
                addMessage(mess);
                scrollToBottom();

            } else {
                console.log("go here");
                // send to notification handle
            }
        }
    }


    // fetch newest list message
    const getListMessage = async (targetId) => {
        const numberOfMess = 20;
        const response = await loadMessage(targetId, numberOfMess);
        setMessageList(response);
    }

    // cache change target user, render 10 new mess
    useEffect(() => {
        if (target) {
            // eslint-disable-next-line react/prop-types
            getListMessage(target.id);
        }
    }, [target]);


    const handleScroll = useCallback(async () => {
        // const container = containerRef.current;
        if (containerRef.current.scrollTop === 0 && !loading) {
            setLoading(true);
            console.log("load: " + messageList.length);
            try {
                var newListMess = await loadListMessageById(messageList[0]?.id, 10);
                setMessageList(previousListMessage => [...newListMess, ...previousListMessage]);
            } catch (error) {
                console.error('Error fetching WebSocket host info:', error);
            } finally {
                setLoading(false);
            }
        }
    }, [messageList, loading]);


    useEffect(() => {
        const container = containerRef.current;
        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const addMessage = (newMessage) => {
        setMessageList(previousMessage => [...previousMessage, newMessage]);
    }
    const addMessageTop = (newMessage) => {
        setMessageList(previousMessage => [newMessage, ...previousMessage]);
    }

    const sendMessage = (e) => {
        e.preventDefault();
        if (target == null) {
            return;
        }
        const message = e.target.message.value;
        if (message && stompClient) {
            // collect and send data
            const data = {
                sender: getUserId(),
                targetId: target.id,
                message: message,
                timestamp: new Date()
            }
            stompClient.publish({
                destination: '/app/private-message',
                body: JSON.stringify(data)
            });

            // create message component and add to page
            var mess = {
                id: guidGenerator(),
                sender: getUserId(),
                message: message,
                time: new Date()
            }
            console.log(mess);
            addMessage(mess);
            scrollToBottom();
            setMessageInput('');
        }
    }

// eslint-disable-next-line react/prop-types
    const MessageLine = ({message, type, timestamp}) => {

        const containerClasses = {
            display: "flex",
            justifyContent: type ? 'begin' : 'end'
        }
        const messsagebox = {
            backgroundColor: !type ? "var(--colorBrandBackground2)" : "var(--colorBrandForeground2)",
            color: !type ? "var(--colorNeutralForeground1)" : "var(--colorNeutralBackground1Hover)",
            margin: "2px 20px",
            padding: "6px 15px 8px 15px",
            borderRadius: "var(--borderRadiusLarge)",
            borderBottomRightRadius:type?"var(--borderRadiusLarge)": "0",
            borderBottomLeftRadius:!type?"var(--borderRadiusLarge)" : "0",
            maxWidth: "50%"
        }

        return (
            <motion.div
                key={message.id}
                initial={{opacity: 1, x: 0}}
                animate={{opacity: 1, x: 0}}
                exit={{opacity: 1, x: -20}}
                transition={{duration: 0.5}}
                style={containerClasses}
            >

                <Tooltip content={toHour(new Date(timestamp))}>
                    <div style={messsagebox}>
                        <div className='message'>{message ? message : "empty"}</div>
                    </div>
                </Tooltip>

            </motion.div>
        )
            ;
    }

// eslint-disable-next-line react/prop-types
    const ListMessagesDisplay = ({list}) => {
        if (list) {
            var listMess = groupMessagesByDate(list);
            return (
                <>
                    <AnimatePresence>
                        {
                            Object.entries(listMess).map(([date, messages]) => (
                                <div key={date}
                                >
                                    <div style={{
                                        textAlign: "center",
                                        color: "var(--colorBrandForegroundOnLightHover)"
                                    }}>{date}</div>

                                    {messages.map(
                                        (message, index) =>
                                            (
                                                <MessageLine key={message.id} message={message.message}
                                                             status={status}
                                                             type={message.sender !== getUserId()}
                                                             timestamp={message.time}/>
                                            )
                                    )
                                    }
                                </div>
                            ))
                        }
                        <div ref={endOfMessagesRef}/>
                    </AnimatePresence>
                </>

            );
        } else {
            return (<div>not found</div>);
        }
    }

    const [messageInput, setMessageInput] = useState('');

    return (
        <>
            {/*message view*/}
            <div className={`${classes.messageView} scrollbar-visible-on-hover`} ref={containerRef}>
                <ListMessagesDisplay list={messageList}/>
            </div>
            {/*input component */}
            <form className={classes.inputView} onSubmit={sendMessage}>
                <Input className={classes.inputMessage} name="message" value={messageInput}
                       onChange={(e)=> setMessageInput(e.target.value)}
                       contentAfter={
                    <>
                        <Button icon={<Add20Regular className={classes.icon}/>}
                                style={{backgroundColor: "transparent", border: "none", padding: 0}}></Button>
                        <Divider vertical style={{height: "90%", margin: "0 8px"}}/>
                        <Button type="submit" icon={<Send20Regular className={classes.icon}/>}
                                style={{backgroundColor: "transparent", border: "none", padding: 0}}></Button>
                    </>
                }/>
            </form>
        </>
    );

}