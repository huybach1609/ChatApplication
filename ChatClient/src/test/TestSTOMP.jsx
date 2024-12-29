import {Button, Input} from '@nextui-org/react';
import {useEffect, useRef} from 'react';
import {useStompClient} from "../context/StompClientContext.jsx";
import {getUserId} from "../utils/utils.jsx";


const ChatRoom = () => {
    const {stompClient, subscribeTopic } = useStompClient();

    // let stompClient = null;
    const userRef = useRef();
    const targetRef = useRef();

    useEffect(() => {
        if (stompClient) {
            console.log(stompClient);

            const publicUrl = '/chatroom/public';
            const privateUrl = `/user/${getUserId()}/private`;
            console.log("privateUrl: " + privateUrl);


            subscribeTopic(publicUrl, onMessageReceived);
            subscribeTopic(privateUrl, onMessagePrivateReceived);
        }
    }, [stompClient, subscribeTopic]);




    const onMessagePrivateReceived = (payload) => {
        let payloadData = JSON.parse(payload.body);
        console.log(payloadData);

    }
    //
    // const onError = (error) => {
    //     console.error('Could not connect to WebSocket server. Please refresh this page to try again!', error);
    // };

    const onMessageReceived = (payload) => {
        let payloadData = JSON.parse(payload.body);
        console.log(payloadData);
    };

    const sendPrivateMessage = (event) => {
        event.preventDefault();
        const message = {
            sender: userRef.current.value,
            to: targetRef.current.value, // Set the receiver's username for private messages
            message: event.target.message.value,
            type: 'DELIVERY', // or 'GROUP' for group messages
            date: new Date()
        };
        stompClient.publish({
                destination: '/app/private-message',
                body: JSON.stringify(message),
            }
        );
    }
    const sendPublicMessage = (event) => {
        event.preventDefault();
        const message = {
            sender: getUserId(),
            message: event.target.message.value,
            type: 'DELIVERY', // or 'GROUP' for group messages
            date: new Date()
        };
        stompClient.publish({
                destination: '/app/message',
                body: JSON.stringify(message),
            }
        );
    }

    return (
        <div>
            <div className="flex gap-10 m-5 justify-center">
                {/*<Button onClick={connect}>connect</Button>*/}
                {/* <Button onClick={ }>disconnect</Button> */}
                <Input placeholder='user' name='user' ref={userRef} startContent={<div>@</div>}/>
                <Input placeholder='target' name='target' ref={targetRef} startContent={<div>#</div>}/>
            </div>

            private
            <form onSubmit={sendPrivateMessage} className="flex gap-10 m-5 justify-start">
                <Input placeholder='message' name='message'/>
                <Button type='submit'>send</Button>
            </form>

            public
            <form onSubmit={sendPublicMessage} className="flex gap-10 m-5 justify-start">
                <Input placeholder='message' name='message'/>
                <Button type='submit'>send</Button>
            </form>
        </div>
    );
}
export default ChatRoom;
// const connect = () => {
//     let socket = new SockJS('http://localhost:9000/ws');
//     stompClient = new Client({
//         webSocketFactory: () => socket,
//         reconnectDelay: 5000,
//         onConnect: onConnected,
//         onStompError: onError,
//     });
//     stompClient.activate();
// };

// const onConnected = (frame) => {
//     // Subscribe to a topic
//     const publicUrl = '/chatroom/public';
//     const privateUrl =`/user/${userRef.current.value}/private`;
//     console.log('Connected: ' + frame );
//     console.log("privateUrl: " + privateUrl);
//
//     stompClient.subscribe(publicUrl, onMessageReceived);
//     stompClient.subscribe(privateUrl, onMessagePrivateReceived);
// };

