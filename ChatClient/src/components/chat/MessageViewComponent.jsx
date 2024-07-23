import React, { useRef, useEffect, useState } from 'react';
import { Input, Button, Avatar } from '@nextui-org/react';
import { SendHorizonal } from 'lucide-react';
import { getTarget, getUser, getUserId, loadMessage, removeTarget } from '../../utils/utils';
import ReactDOM from 'react-dom/client';


const MessageViewComponent = ({ sockett, target }) => {
    const messagesRef = useRef(null);

    const [listmessage, setListMessage] = useState(null);

    // catche change target user, render 10 new mess
    useEffect(() => {
        if (target) {
            getListMessage(target.id);
        }
    }, [target]);
    const getListMessage = async (targetId) => {
        var numberOfMess = 10;
        const response = await loadMessage(targetId, numberOfMess);
        setListMessage(response);
    }

    useEffect(() => {
        if (sockett != null) {
            sockett.onmessage = (event) => {
                console.log(event);
                const messDetail = JSON.parse(event.data);
                if (messDetail.type === "DELIVERY") {
                    var incomeUser = JSON.parse(getTarget());

                    if (incomeUser.id == messDetail.sender) {
                        // newMessage.innerHTML = `${incomeUser.fullName}:${messDetail.message}`;
                        const newMessage = document.createElement('div');
                        newMessage.className = "w-full"

                        const root = ReactDOM.createRoot(newMessage);
                        root.render(<MessageLine picture={incomeUser.picture} message={messDetail.message} type={1} />);
                        messagesRef.current.appendChild(newMessage);
                    } else {
                        // send to notification handle 
                    }
                }
            }
        }
        // clear up event listener when components upmount or socket disconnect
        return () => {
            sockett.onmessage = null;
            removeTarget();
        }
    }, [sockett])

    const MessageLine = ({ picture, message, type }) => {

        if (type === 1) {
            return (
                <div className='w-full p-5 m-1 gap-2 flex items-center justify-begin'>
                    <Avatar className='' src={picture} /> <div>{message}</div>
                </div>
            );
        } else {
            return (
                <div className='w-full p-5 m-1 gap-2 flex items-center justify-end'>
                    <div>{message}</div> <Avatar className='' src={picture} />
                </div>
            );
        }

    }

    const sendMessage = (e) => {

        e.preventDefault();
        if (target == null) {
            return;
        }

        const message = e.target.message.value;

        if (sockett != null) {
            const data = {
                targetId: target.id,
                message: message
            }
            sockett.send(JSON.stringify(data));

            const newMessage = document.createElement('div');
            // ${myUidRef.current.value} 
            newMessage.textContent = `: ${message}`;
            newMessage.className = "w-full"

            const root = ReactDOM.createRoot(newMessage);
            const avatar = JSON.parse(getUser()).picture
            root.render(<MessageLine picture={avatar ? avatar : null} message={message} type='0' />);
            messagesRef.current.appendChild(newMessage);
        }
    }
    return (
        <div className='bg-slate-300/15 flex-1 flex flex-col justify-between '>
            <p id="response"></p>
            <div className='flex-1 flex' >
                <div className='h-[60vh] w-full overflow-y-auto overflow-x-hidden' ref={messagesRef}>
                    {listmessage != null ? listmessage.slice().reverse().map((message, index) => {
                        if (message.sender === getUserId()) {
                            return (
                                <MessageLine message={message.message} type={0} />
                            );
                        } else {
                            return (
                                <MessageLine message={message.message} type={1} />
                            );
                        }
                    }) : <p>not found</p>}
                </div>
            </div>
            <form onSubmit={sendMessage} className='flex bg-slate-400/15 h-20 justify-center items-center px-2 gap-2'>
                <Input type="text"
                    className='h-14'
                    label="Message"
                    name="message"
                    endContent={
                        <Button
                            className=''
                            type='submit'
                            isIconOnly><SendHorizonal />
                        </Button>
                    }
                />
            </form>
        </div>
    );
}
export default MessageViewComponent;

