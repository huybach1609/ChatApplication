import { useState, useEffect } from "react";
import { getListFriend } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import CheckConnection from "../websocket/connection";
import { Avatar, Button, Divider, ScrollShadow, Spinner } from "@nextui-org/react";

const ListFriendSideBar = () => {
    const [listFriend, setListFriend] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            const friends = await getListFriend();
            setListFriend(friends);
        };
        load();
    }, []);
    const RedirectPage = (username) => {
    }

    return (
        <ScrollShadow className="h-full no-scrollbar">
            <div className="flex flex-col gap-1 ">
                {listFriend != null ? listFriend.map((friend, index) => (
                    <Button key={friend.username} onPress={() => navigate(`/chat/${friend.username}`)} className="flex gap-3 bg-transparent hover:bg-blue-200/20 py-10 px-3 rounded-lg" >
                        <Avatar src={friend.picture} />
                        <div className="flex-1" >
                            <div className="flex w-full justify-between">
                                <span className="text-small font-semibold text-default-600">
                                    {friend.fullName}
                                </span>
                                <span className="text-small text-default-400">
                                    10:30AM
                                </span>
                            </div>
                            <div className="text-small text-left text-default-400">hey</div>
                        </div>
                    </Button>
                )) : <><Spinner /></>}

            </div>
        </ScrollShadow>
    );
}
export default ListFriendSideBar;