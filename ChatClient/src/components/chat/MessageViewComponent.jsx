import  { useRef, useEffect, useState, useCallback } from 'react';
import { Input, Button,  ScrollShadow, Spinner} from '@nextui-org/react';
import { SendHorizonal } from 'lucide-react';
import {  getUserId, loadListMessageById, loadMessage } from '../../utils/utils';
import { useWebSocket } from '../../context/WebsocketContext.jsx';
import { toHour, groupMessagesByDate } from '../../utils/dateUtils';
import { Message } from '../../model/Message'

// eslint-disable-next-line react/prop-types
const MessageViewComponent = ({ target }) => {
    // context: websocket
    const { socket, setOnMessage } = useWebSocket();

    // ref
    const endOfMessagesRef = useRef(null);
    const containerRef = useRef();
    const messageInputRef = useRef(null);

    //
    const [listMessage, setListMessage] = useState(null);
    const [loading, setLoading] = useState(false);




    const getListMessage = async (targetId) => {
        const numberOfMess = 10;
        const response = await loadMessage(targetId, numberOfMess);
        setListMessage(response);
    }

    //roll to last went lissmessage update
    useEffect(() => {
        if(loading === false){
            if (endOfMessagesRef.current) {
                endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [listMessage]);

    // catche change target user, render 10 new mess
    useEffect(() => {
        if (target) {
            getListMessage(target.id);
        }
    }, [target]);


    useEffect(() => {
        console.log(target.fullName);
        if (socket) {
            setOnMessage((event) => {
                console.log("event: " + event);
                const messDetail = JSON.parse(event.data);
                if (messDetail.type === "DELIVERY") {
                    if (target.id === messDetail.sender) {
                        const newMess = new Message(messDetail.sender, messDetail.to, messDetail.time, messDetail.message, messDetail.type);
                        addMessage(newMess);
                    } else {
                        console.log("go here");
                        // send to notification handle
                    }
                }
            });
        }


        // clear up event listener when components upmount or socket disconnect
        return () => {
            socket.onmessage = null;
        }
    }, [socket, setOnMessage]);

    const handleScroll = useCallback(async () => {
        const container = containerRef.current;
        if (container.scrollTop === 0 && !loading) {
            setLoading(true);
            try {
                var newListMess = await loadListMessageById(listMessage[0]?.id, 10);
                setListMessage(previousListMessage => [...newListMess, ...previousListMessage]);
            } catch (error) {
                console.error('Error fetching WebSocket host info:', error);
            } finally {
                setLoading(false);
            }
        }
    }, [listMessage, loading]);

    useEffect(() => {
        const container = containerRef.current;
        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const addMessage = (newMessage) => {
        setListMessage(previousMessage => [...previousMessage, newMessage]);
    }

    // eslint-disable-next-line react/prop-types
    const MessageLine = ({ message, type, timestamp }) => {
        const isType1 = type === 1;
        const containerClasses = `m-1 gap-2 flex items-center ${isType1 ? 'justify-begin' : 'justify-end'}`;
        const messageClasses = `max-w-[80%] text-small rounded-b-lg px-5 py-3 ${isType1 ? 'rounded-tr-lg text-indigo-950 bg-slate-100' : 'rounded-tl-lg text-indigo-50 bg-slate-900'}`;
        const timeClasses = `${isType1 ? 'text-indigo-950/70' : 'text-right text-indigo-50/50 text-xs'}`;

        return (
            <div className={containerClasses}>
                {/* <Avatar className='' src={picture} /> */}
                <div className={messageClasses}>
                    <div className='message'>{message}</div>
                    <div className={`time ${timeClasses}`}>{toHour(new Date(timestamp))}</div>
                </div>
            </div>
        );
    }

    const scrollToBottom = () => {
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (target == null) {
            return;
        }

        const message = e.target.message.value;

        if (socket != null) {
            const data = {
                targetId: target.id,
                message: message
            }
            socket.send(JSON.stringify(data));

            var mess = new Message(getUserId(), "", new Date(), message, "");
            addMessage(mess)

            var resetButton = document.getElementById('resetButton');
            resetButton.click();

            scrollToBottom();
        }
    }

    const ListMessagesDisplay = ({ list }) => {
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
                                                <MessageLine key={index} message={message.message} type={0} timestamp={message.time} />
                                            );
                                        } else {
                                            return (
                                                // <MessageLine key={index} message={message.message} type={1} picture={target.picture} />
                                                <MessageLine key={index} message={message.message} type={1} timestamp={message.time} />
                                            );
                                        }
                                    })}
                                </div>
                            </div>
                        ))
                    }
                    <div ref={endOfMessagesRef} />
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
            <ScrollShadow id='messages' className='flex-1 overflow-y-auto overflow-x-hidden scrollbar-visible-on-hover' ref={containerRef} >
                {loading?<Spinner className='mx-auto'></Spinner>:""}
                <ListMessagesDisplay list={listMessage} />
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
                            isIconOnly><SendHorizonal className='text-stone-600/60' />
                        </Button>
                    }
                />
                <button id="resetButton" type='reset' hidden>asdfas</button>
            </form>
        </>
    );
}
export default MessageViewComponent;

