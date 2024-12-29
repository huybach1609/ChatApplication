import {useEffect, useState} from "react";
import FriendListComponent from "./FriendListComponent.jsx";
import {
    Button,
    Image,
    ModalBody,
    ModalFooter,
} from "@nextui-org/react";
import {AcceptRequestFriend, deleteFriendShip, getListFriendRequest, getUserId} from "../../utils/utils.jsx";
import {useAppContext} from "../../context/AppContext.jsx";

const FriendRequest = () => {
    const [listFriend, setListFriend] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const {showNotification} = useAppContext();

    useEffect(() => {
        const getListFriend = async () => {
            const response = await getListFriendRequest();
            setListFriend(response);
        }
        getListFriend();
    }, []);


    const removeItem = (id) => {
        setListFriend(prevList => prevList.filter(item => item.id !== id));
    };

    // eslint-disable-next-line react/prop-types
    const Action = ({object}) => {
        return (
            <>
                <ModalBody className="pt-5">
                    <div>
                        {/* eslint-disable-next-line react/prop-types */}
                        <Image src={object.picture} className="w-20 h-20 object-cover"/>
                        <div className="">
                            <div className="text-2xl font-semibold">{object.fullName}</div>
                            <div className="text-stone-600">@{object.username}</div>
                            <div className="text-center m-2">description</div>
                        </div>

                    </div>
                </ModalBody>
                <ModalFooter className="flex justify-center gap-5">
                    <Button variant="flat" color="success" className="w-full" size="md"
                            onClick={() => handleAccept(object.id)}>Accept</Button>
                    <Button variant="flat" className="w-full" size="md"
                            onClick={() => handleDismiss(object.id)}>Dismiss</Button>
                </ModalFooter>
            </>
        );
    }
    const handleAccept = (data) => {
        let check = true;
        const dataResponse = {
            request: data,
            address: getUserId(),
            status: "ACCEPTED"
        };
        const sendAcceptRequest = async () => {
            const response = await AcceptRequestFriend(dataResponse);
            console.log(response.status);
            if (response.status === 400) {
                check = false;
                showNotification(response.data.message);
                return;
            }else{
                removeItem(data);
                setCloseStatus(!closeStatus);
                showNotification(response.data);
            }
        };
        sendAcceptRequest();
    }
    const handleDismiss = (data) => {

        const sendRequest = async () => {
            const response = await deleteFriendShip( data , getUserId());
            showNotification(response);
        }
        sendRequest();
        removeItem(data);
        setCloseStatus(!closeStatus);
    }

    const [closeStatus, setCloseStatus] = useState(false);
    const Heading =()=>{
        return(<>
            <div className="text-xl font-semibold mb-3">Friend Request</div>
        </>);
    }

    return (
        <div>
            <FriendListComponent
                list={listFriend}
                setSelectedFriend={setSelectedFriend}
                closeStatus={closeStatus}
                Heading={Heading()}
            >
                <Action object={selectedFriend}/>
            </FriendListComponent>
        </div>
    )
        ;
}
export default FriendRequest