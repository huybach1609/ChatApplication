import {
    Button,
    Card,
    CardBody,
    CardFooter,
    Modal,
    ModalContent,
    useDisclosure
} from "@nextui-org/react";
import {Ellipsis} from "lucide-react";
import ImageComponent from "../default/ImageComponent.jsx";
import {useEffect, useState} from "react";

// eslint-disable-next-line react/prop-types
const FriendListComponent = ({children, list,  Heading, setSelectedFriend, closeStatus}) => {
    const {isOpen, onOpen, onClose} = useDisclosure();


    const handleOpen = (item) => {
        setSelectedFriend(item);
        onOpen();
    }


    const handleSomething = () => {
        onClose();
    }

    // handle to close modal
    useEffect(() => {
        onClose();
    }, [closeStatus]);

    return (
        <div className="m-5 ">
            {/*heading*/}
            <div className="flex justify-between">
                {Heading}
            </div>
            <div className="mt-3 grid grid-cols-2 lg:grid-cols-4 gap-3">
                {list != null && list.length > 0  ? (
                        list.map((item, index) => (
                            <Card className="" key={index} isPressable
                                  onClick={() => handleOpen(item)}>
                                <CardBody className="overflow-visible p-0 ">
                                    <ImageComponent src={item.picture} alt="none"
                                                    style="w-full h-[140px] object-cover rounded-xl"/>
                                </CardBody>
                                <CardFooter className="flex justify-between gap-1 items- text-sm h-13 px-4">
                                    <div>
                                        <div className="font-semibold">{item.fullName}</div>
                                        <div className="text-stone-700/80">@{item.username}</div>

                                    </div>
                                    <div>
                                        <Ellipsis className="w-5 hover:text-blue-600"/>
                                    </div>
                                </CardFooter>
                            </Card>))) :
                    (<div>no found</div>)
                }
                <Modal backdrop="transparent" isOpen={isOpen} onClose={handleSomething}
                       className="m-0 p-0 "
                >
                        <ModalContent className="m-0 p-0">
                            {(onClose) => (
                            <>
                                {children}
                            </>
                            )}
                        </ModalContent>
                </Modal>
            </div>
        </div>

    );
}
export default FriendListComponent;