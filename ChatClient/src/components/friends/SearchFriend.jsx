import FriendListComponent from "./FriendListComponent.jsx";
import {
    Divider,
    Image,
    Input,
    Listbox,
    ListboxItem,
    ModalBody,
    ModalFooter,
} from "@nextui-org/react";
import {getUserId, isFriend, searchUser, sendRequestFriend} from "../../utils/utils.jsx";
import {useEffect, useState} from "react";
import {useAppContext} from "../../context/AppContext.jsx";

const SearchFriend = () => {
    const [listFriend, setListFriend] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);


    // eslint-disable-next-line react/prop-types
    const Action = ({object}) => {
        const [isFriend1, setIsFriend] = useState(false);
        const {showNotification} = useAppContext();


        useEffect(() => {

            const checkFriendship = async () => {
                const check = await isFriend(getUserId(), object.id);
                console.log(check);
                setIsFriend(check);
            };

            if (object) {
                checkFriendship();
            }

            // eslint-disable-next-line react/prop-types
        }, [object]); // Dependency array to re-run the effect if `object.id` changes

        const sendRequest = async () => {
            const data = {
                request: getUserId(),
                address: selectedFriend.id
            }
            const response = await sendRequestFriend(data);
            showNotification(response);
        }
        return (
            <>
                <ModalBody className="pt-5">
                    <div className="flex gap-3 ">
                        {/* eslint-disable-next-line react/prop-types */}
                        <Image src={object.picture} className="w-20 h-20 object-cover"/>
                        <div className="">
                            <div className="text-2xl font-semibold">{object.fullName}</div>
                            <div className="text-stone-600">@{object.username}</div>
                            <div className="text-center m-2">description</div>
                        </div>

                        {/*<Button onClick={()=> showNotification("hello")}>heelo</Button>*/}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Listbox aria-label="requestAction">
                        {isFriend1 ?
                            null
                            :
                            (
                                <ListboxItem key="request" color="secondary" variant="shadow"
                                             isDisabled={isFriend1}
                                             onClick={sendRequest}
                                >
                                    Send request
                                </ListboxItem>
                            )

                        }
                        {/*<Button onPress={onClose}>Close</Button>*/}

                        <ListboxItem key="info" color="primary" variant="shadow">
                            Full info
                        </ListboxItem>
                        {/*<ListboxItem color="danger" variant="shadow" onPress={onClose} >Close</ListboxItem>*/}
                    </Listbox>
                </ModalFooter>

            </>
        );
    }
    const searchFriend = async (event) => {
        // event.preventDefault();
        console.log(event.target.value)
        const response = await searchUser(event.target.value);
        // console.log(response);
        setListFriend(response);
    }

    const Heading = () => {
        return (
            <>
                <div className="text-xl font-semibold mb-3">Search People</div>
                <div className="m-2">
                    <Input onChange={searchFriend} type="text" variant="flat" label="Search"
                           color="primary"
                           startContent="@" name="key"
                           className=""
                    />
                </div>
            </>);
    }

    return (
        <div>
            <FriendListComponent
                list={listFriend}
                Heading={Heading()}
                setSelectedFriend={setSelectedFriend}
            >
                <Action object={selectedFriend}/>
            </FriendListComponent>
        </div>
    );
}
export default SearchFriend