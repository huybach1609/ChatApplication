// ChatPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Card, CardFooter, Divider, Image, Input, useCheckbox } from '@nextui-org/react';
import axios from 'axios';
import { getInfoUser } from '../../utils/utils';
import MessageViewComponent from './MessageViewComponent';
import MessageViewStompComponent from "./MessageViewStompComponent.jsx";


const ChatPage = () => {
    const { userId } = useParams();

    const [userTarget, setUserTarget] = useState(null);


    useEffect(() => {
        const target = async () => {
            const response = await getInfoUser(userId);
            setUserTarget(response);
        }
        target();
    }, [userId]);
    const CardInfo = () => {

        return (
            <Card
                isFooterBlurred
                radius="lg"
                className="border-none"
            >
                <img
                    alt="avatar"
                    className="object-center w-full"
                    src={!userTarget ? "" : userTarget.picture}
                />
                <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden 
                                       py-1 absolute before:rounded-xl rounded-large bottom-1
                                       h-[calc(100%_-8px)] w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <div className="font-semibold text-xl text-white/80">{userTarget ? userTarget.fullName : ""}</div>
                    <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
                        info
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    return (
        <div className='py-5 px-5 flex flex-col gap-2 h-[100vh] '>
            {/* heading info */}
            <div className="h-[80px] flex flex-col gap-5">
                <CardInfo />
            </div>
            <Divider />
            {/* message view */}
            {userTarget == null ?
                <p>select</p>
                :
                // <p>{userTarget.fullName}</p>
                <MessageViewStompComponent target={userTarget} />
            }
        </div>
    );
};

export default ChatPage;
