import {Button, Image, Listbox, ListboxItem, ModalBody, ModalFooter, Select, SelectItem} from "@nextui-org/react";
import FriendListComponent from "./FriendListComponent.jsx";
import {useEffect, useState} from "react";
import {blockFriend, getListBlockedFriendRequest, getListFriend} from "../../utils/utils.jsx";
import {useAppContext} from "../../context/AppContext.jsx";

const FriendPage = () => {
    const [listFriend, setListFriend] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [typeList, setTypeList] = useState(0);
    const [closeStatus, setCloseStatus] = useState(false);
    const {showNotification} = useAppContext();


    const removeItem = (id) => {
        setListFriend(prevList => prevList.filter(item => item.id !== id));
    };

    const handleClick =()=>{
        showNotification("hello");
        setCloseStatus(!closeStatus);
    }
    const handleBlock =(id)=>{
        const block = async ()=>{
            const response = await blockFriend(id, "block");
            showNotification(response);
        }
        block();
        removeItem(id);
        setCloseStatus(!closeStatus);
    }
    const handleUnBlock =(id)=>{
        const unblock = async ()=>{
            const response = await blockFriend(id, "unblock");
            showNotification(response);
        }
        unblock();
        removeItem(id);
        setCloseStatus(!closeStatus);
    }


    // eslint-disable-next-line react/prop-types
    const Action = ({object}) => {
        return (
            <>
                <ModalBody className="pt-5 m-0 ">
                    <div>
                        {/* eslint-disable-next-line react/prop-types */}
                        <Image src={object.picture} className="w-20 h-20 object-cover"/>
                        <div className="">
                            <div className="text-2xl font-semibold">{object.fullName}</div>
                            <div className="text-stone-600">@{object.username}</div>
                        </div>
                    </div>
                </ModalBody>
                {typeList === 0 ? (
                    <ModalFooter className="m-0 p-0">
                        <Listbox aria-label="all"
                                 itemClasses={{
                                     base: "px-3 first:rounded-t-medium last:rounded-b-medium rounded-none gap-3 h-12 ",
                                 }}
                        >
                            <ListboxItem key="info" color="primary" variant="flat">
                                View full info
                            </ListboxItem>
                            <ListboxItem key="message" color="primary" variant="flat">
                                Message
                            </ListboxItem>
                            <ListboxItem key="removeFriend" color="danger" variant="flat">
                                Remove Friend
                            </ListboxItem>
                            <ListboxItem key="block" color="danger" variant="flat" onClick={()=>handleBlock(object.id)}>
                                Block
                            </ListboxItem>
                        </Listbox>
                    </ModalFooter>
                ) : (
                    <ModalFooter className="">
                        <Button variant="flat" color="success" className="w-full" size="md"
                                onPress={() => handleUnBlock(object.id)}

                        >Remove</Button>
                        <Button variant="flat" className="w-full" size="md"
                                onPress={() => handleClick()}
                        >Dismiss</Button>
                    </ModalFooter>
                )}

            </>
        );
    }


    useEffect(() => {
         const fetchList = async () => {
             let listF = [];
             if (typeList === 0) {
                 listF = await getListFriend();
             } else if (typeList === 1) {
                 listF = await getListBlockedFriendRequest();
             }
             setListFriend(listF);
             console.log(listF);
         };
         fetchList();
    }, [typeList]);

    const Heading = () => {
        const handleSelect = (value) => {
            console.log(value);
            setTypeList(Number(value));
        }

        return (<>
            <div className="text-xl font-semibold mb-3">Friend</div>
            <Select
                color="secondary"
                className="max-w-xs"
                onChange={(e) => handleSelect(e.target.value)}
                defaultSelectedKeys={typeList.toString()}
                label="View"
            >
                <SelectItem key="0" value="0" >
                    All Friend
                </SelectItem>
                <SelectItem key="1" value="1"
                >
                    Blocked
                </SelectItem>
            </Select>

        </>);
    }

    return (
        <>
            <FriendListComponent
                list={listFriend}
                setSelectedFriend={setSelectedFriend}
                Heading={Heading()}
                closeStatus={closeStatus}
            >
                <Action object={selectedFriend}/>
            </FriendListComponent>

        </>
    );

}
export default FriendPage