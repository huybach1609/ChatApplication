import React, { useState, useRef, useEffect, useContext } from 'react';
import { getUserId, getListFriend, getToken, setTarget } from '../utils/utils.jsx';
import { Input, Select, SelectItem, Switch } from '@nextui-org/react';
import MessageViewComponent from '../components/chat/MessageViewComponent.jsx';
import { WebsocketContext } from '../context/WebsocketContext.jsx';
import { useParams } from 'react-router-dom';

const CheckConnection = () => {
    // const [socket, setSocket] = useState(null);

    const info= useContext(WebsocketContext);
    
    let {userId} =useParams();

    const [targetUserIdRef, setTargetUserIdRef] = useState(null);
    const myUidRef = useRef(null);

    const [isSelected, setIsSelected] = React.useState(false);
    const [listFriend, setListFriend] = useState([]);

    // first load, list friend 
    useEffect(() => {
        const load = async () => {
            const friends = await getListFriend();
            setListFriend(friends);
        };
        load();
        console.log(info.check);
        if(info){
            setIsSelected(true);
        }else{
            setIsSelected(false);
        }
    }, []);

    const processConnection = (e) => {
        setIsSelected(!isSelected);
        if (e) {
            connect();
        } else {
            disconnect();
        }
    }

    const ListFriend = ({ list }) => {
        const handleSelectUser = (e) => {
            var currentUse = list.find(item => item.id === e.target.value);
            setTargetUserIdRef(currentUse);
            setTarget(JSON.stringify(currentUse));
            console.log(currentUse);
        }

        return (
            <Select
                label="Friend"
                placeholder='Select a user'
                onChange={handleSelectUser}
                selectedKeys={targetUserIdRef ? [targetUserIdRef.id] : []}
            >
                {list.map(friend => (
                    <SelectItem key={friend.id}

                    >
                        {friend.fullName}

                    </SelectItem>
                ))}
            </Select>
        );
    }


    return (
        <div className='h-full w-full flex-1 flex flex-col'>
            {/* info to send  */}
            <div className='mb-2'>
                <div className='flex gap-2 mb-2'>
                    <Input isDisabled
                        size='sm'
                        type="text"
                        label="Your userId"
                        defaultValue={getUserId()}
                        ref={myUidRef}
                    />

                    <div>
                        <Switch color='success' isSelected={isSelected} onValueChange={processConnection}></Switch>
                        <p className="text-small text-default-500">{isSelected ? "connect" : "disconnect"}</p>
                    </div>
                </div>
                {listFriend.length > 0 ?
                    <ListFriend list={listFriend} />
                    :
                    <p>no friend found</p>
                }
            </div>
            {info.socket == null ?
                (
                    <p>connecting...</p>
                )
                :
                (
                    targetUserIdRef == null ?
                        <p>select</p>
                        :
                        <MessageViewComponent sockett={info.socket} target={targetUserIdRef} />
                )
            }

        </div>
    )
};
export default CheckConnection;
   // const getHostWebShocket = async () => {
    //     try {
    //         const response = await axios
    //             .get(API_URL + '/api/ws/info', {
    //                 headers: {
    //                     Authorization: `Bearer ${getToken()}`,
    //                 }
    //             });
    //         return response.data;
    //     } catch (error) {
    //         console.error('Error fetching WebSocket host info:', error);
    //         return null;
    //     }
    // }
    // const connect = async () => {
    //     const hostWebShocket = await getHostWebShocket();

    //     console.log(hostWebShocket);
    //     if (hostWebShocket == null) {
    //         return;
    //     }
    //     const userId = myUidRef.current.value;
    //     const newSocket = new WebSocket(`ws://${hostWebShocket}/ws?userId=${userId}`);

    //     newSocket.onopen = () => {
    //         console.log('Connected');
    //     };

    //     newSocket.onclose = () => {
    //         setIsSelected(false);
    //         console.log('Disconnect');
    //     };
    //     // setSocket(newSocket);
    // }

    // const disconnect = () => {
    //     if (socket != null) {
    //         socket.close();
    //         // setSocket(null);
    //     }
    // };