import {useRef, useEffect, useState, useCallback} from 'react';
import {Input, Button, ScrollShadow, Spinner} from '@nextui-org/react';
import {SendHorizonal} from 'lucide-react';
import {getUserId, loadListMessageById, loadMessage} from '../../utils/utils';
import {toHour, groupMessagesByDate} from '../../utils/dateUtils';
import {Message} from '../../model/Message'
import {motion} from "framer-motion";
import {useStompClient} from "../../context/StompClientContext.jsx";

// eslint-disable-next-line react/prop-types
const MessageViewComponent = ({target}) => {
    // context: stomp client
    const {stompClient, updateSubscriptionCallback, isConnected} = useStompClient();

    const [listmessage, setListMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const containerRef = useRef();
    const messageInputRef = useRef(null);
    const endOfMessagesRef = useRef(null);

    useEffect(() => {
        // eslint-disable-next-line react/prop-types
        console.log(target.fullName);

        if (stompClient && isConnected) {
            updateSubscriptionCallback("/chatroom/public", onMessageReceived);
            updateSubscriptionCallback(`/user/${getUserId()}/private`, onMessagePrivateReceived);
            console.log("MessageViewStompComponent: subscribe ");
        }

        return () => {
            console.log("MessageViewComponent: unsubscribing from topics");
            // socket.onmessage = null;
        }
    }, [stompClient, isConnected]);

    // fetch newest list message
    const getListMessage = async (targetId) => {
        const numberOfMess = 10;
        const response = await loadMessage(targetId, numberOfMess);
        setListMessage(response);
    }

    //roll to last went list message update
    useEffect(() => {
        if (loading === false) {
            if (endOfMessagesRef.current) {
                endOfMessagesRef.current.scrollIntoView({behavior: 'smooth'});
            }
        }
    }, [listmessage, loading]);

    // cache change target user, render 10 new mess
    useEffect(() => {
        if (target) {
            // eslint-disable-next-line react/prop-types
            getListMessage(target.id);

        }
    }, [target]);

    const onMessageReceived = (payload) => {
        let payloadData = JSON.parse(payload.body);
        console.log(payloadData);
    };

    const onMessagePrivateReceived = (payload) => {
        let messDetail = JSON.parse(payload.body);
        console.log(messDetail)
        if (messDetail.type === "DELIVERY") {
            if (target.id === messDetail.sender) {
                const newMess = new Message(messDetail.sender, messDetail.to, messDetail.time, messDetail.message, messDetail.type);
                addMessage(newMess);
            } else {
                console.log("go here");
                // send to notification handle
            }
        }
    }

    const handleScroll = useCallback(async () => {
        const container = containerRef.current;
        if (container.scrollTop === 0 && !loading) {
            setLoading(true);
            try {
                var newListMess = await loadListMessageById(listmessage[0]?.id, 10);
                setListMessage(previousListMessage => [...newListMess, ...previousListMessage]);
            } catch (error) {
                console.error('Error fetching WebSocket host info:', error);
            } finally {
                setLoading(false);
            }
        }
    }, [listmessage, loading]);

    useEffect(() => {
        const container = containerRef.current;
        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const addMessage = (newMessage) => {
        setListMessage(previousMessage => [...previousMessage, newMessage]);
    }

    // eslint-disable-next-line react/prop-types
    const MessageLine = ({message, type, timestamp, key}) => {
        const isType1 = type === 1;
        const containerClasses = `m-1 gap-2 flex items-center ${isType1 ? 'justify-begin' : 'justify-end'}`;
        const messageClasses = `max-w-[80%] text-small rounded-b-lg px-5 py-3 ${isType1 ? 'rounded-tr-lg text-indigo-950 bg-slate-100' : 'rounded-tl-lg text-indigo-50 bg-slate-900'}`;
        const timeClasses = `${isType1 ? 'text-indigo-950/70' : 'text-right text-indigo-50/50 text-xs'}`;
        const variants = {
            initial: {  y: 20 },
            animate: {  y: 0 },
            exit: {  y: -20 },
        };

        return (
            <motion.div
                key={key}
                layout
                initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
                animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
                transition={{
                    opacity: { duration: 0.1 },
                    layout: {
                        type: "spring",
                        bounce: 0.3,
                        // duration: messages.indexOf(message) * 0.05 + 0.2,
                    },
                }}
                style={{
                    originX: 0.5,
                    originY: 0.5,
                }}

                className={containerClasses}>
                {/* <Avatar className='' src={picture} /> */}
                <div className={messageClasses}>
                    <div className='message'>{message}</div>
                    <div className={`time ${timeClasses}`}>{toHour(new Date(timestamp))}</div>
                </div>
            </motion.div>
        );
    }

    const scrollToBottom = () => {
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({behavior: 'smooth'});
        }
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (target == null) {
            return;
        }
        const message = e.target.message.value;
        if (stompClient) {
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
            // socket.send(JSON.stringify(data));

            // create message component and add to page
            var mess = new Message(getUserId(), "", new Date(), message, "");
            addMessage(mess)

            // clear input
            var resetButton = document.getElementById('resetButton');
            resetButton.click();
            scrollToBottom();
        }
    }

    const ListMessagesDisplay = ({list}) => {
        if (list) {
            var listMess = groupMessagesByDate(list);
            return (
                <>
                    {
                        Object.entries(listMess).map(([date, messages]) => (
                            <div key={date}>
                                <div className='text-center text-sm text-indigo-950/50'>{date}</div>
                                <div>
                                    {messages.map((message, index) => {
                                        if (message.sender === getUserId()) {
                                            return (
                                                // <MessageLine key={index} message={message.message} type={0} picture={user.picture} />
                                                <MessageLine key={index} message={message.message} type={0}
                                                             timestamp={message.time}/>
                                            );
                                        } else {
                                            return (
                                                // <MessageLine key={index} message={message.message} type={1} picture={target.picture} />
                                                <MessageLine key={index} message={message.message} type={1}
                                                             timestamp={message.time}/>
                                            );
                                        }
                                    })}
                                </div>
                            </div>
                        ))
                    }
                    <div ref={endOfMessagesRef}/>
                </>
            );
        } else {
            return (<div>not found</div>);
        }


    }


    return (
        <>
            <p id="response"></p>
            {/* list message  */}
            <ScrollShadow id='messages' className='flex-1 overflow-y-auto overflow-x-hidden scrollbar-visible-on-hover'
                          ref={containerRef}>
                {loading ? <Spinner className='mx-auto'></Spinner> : ""}
                <ListMessagesDisplay list={listmessage}/>
            </ScrollShadow>
            {/* messsage input */}
            <form onSubmit={sendMessage} className='flex h-20 justify-center items-center px-2 gap-2'>
                <Input type="text"
                       className='h-14'
                       label="Message"
                       name="message"
                       ref={messageInputRef}
                       id='messageInput'
                       endContent={
                           <Button
                               className=''
                               type='submit'
                               isIconOnly><SendHorizonal className='text-stone-600/60'/>
                           </Button>
                       }
                />
                <button id="resetButton" type='reset' hidden>asdfas</button>
            </form>
        </>
    );
}
export default MessageViewComponent;

