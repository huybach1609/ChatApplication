import {isAuthenticated, clearJwt, removeUser, clearUserId, getUser} from "../../utils/utils";
import {Button, Divider, Input, Popover, PopoverTrigger, PopoverContent} from "@nextui-org/react";
import { Info, ListCollapse, Search, Settings, UserPlus, UserRound, ChevronRight, UserSearch} from "lucide-react";
import ListFriendSideBar from "../chat/ListFriend";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import {Listbox} from "@nextui-org/react";
import {ListboxItem} from "@nextui-org/react";

const NaviticationBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const number = 2;
    const getUserName = () => {
        console.log();
        return JSON.parse(getUser()).username;
    }

    const AuthButton = () => {
        return (
            <Popover
                showArrow
                offset={10}
                placement={"top"}
            >
                <PopoverTrigger>
                    <Button className="w-5 h-5 bg-transparent" isIconOnly><UserRound className="h-4 text-stone-400"/>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="">
                    {isAuthenticated() ?
                        <Listbox>
                            <ListboxItem onClick={() => navigate("/stomp")}>Stomp</ListboxItem>
                            <ListboxItem onClick={() => navigate("/" + getUserName() + "/info")}>Info</ListboxItem>
                            <ListboxItem color={"danger"} onClick={logout}>Logout</ListboxItem>
                        </Listbox>
                        :
                        <div>
                            <Listbox>
                                <ListboxItem onClick={() => navigate("/auth/login")}>Log In</ListboxItem>
                                <ListboxItem onClick={() => navigate("/auth/register")}>Register</ListboxItem>
                            </Listbox>
                        </div>
                    }
                </PopoverContent>
            </Popover>
        );
    };
    const FriendFunctionButton = () => {
        return (
            <Popover
                showArrow
                offset={10}
                placement={"top"}
            >
                <PopoverTrigger>
                    <Button className="w-5 h-5 bg-transparent" isIconOnly><UserPlus
                        className="h-4 text-stone-400"/></Button>
                </PopoverTrigger>
                <PopoverContent className="w-[150px]">
                    {isAuthenticated() ?
                        <Listbox>
                            <ListboxItem onClick={() => navigate("/friends/search")}>Search friend</ListboxItem>
                            <ListboxItem onClick={() => navigate("/friends")}>List friend</ListboxItem>
                        </Listbox>
                        :
                        <div>
                        </div>
                    }
                </PopoverContent>
            </Popover>
        );

    }
    const logout = () => {
        clearJwt();
        removeUser();
        clearUserId();
        window.location.reload();
    }

    const FriendPage = () => {
        const cssButton = " flex gap-3 bg-transparent hover:bg-blue-200/20 py-7 px-2 rounded-lg justify-center sm:w-full w-[90%] m-auto ";
        return (
            <div className="flex flex-col gap-2 overflow-hidden ">
                <Button onClick={() => navigate('/friends/list')}
                        startContent={<span
                            className="bg-blue-300/50 p-2 rounded-full w-10 h-10 text-center"><ListCollapse
                            className="text-blue-800 w-5"/></span>}
                        endContent={<ChevronRight className="text-blue-800 sm:block hidden"/>}
                        className={cssButton}
                >
                    <p className="font-semibold flex-1">List</p>
                </Button>

                <Button onClick={() => navigate('/friends/request')}
                        startContent={<span
                            className="bg-blue-300/50 p-2 rounded-full w-10 h-10 text-center">
                            <UserPlus className="text-blue-800"/></span>}
                        endContent={<ChevronRight className="text-blue-800 sm:block hidden"/>}
                        className={cssButton}
                >
                    <p className="font-semibold flex-1">Request</p>
                </Button>

                <Button onClick={() => navigate('/friends/search')}
                        startContent={<span
                            className="bg-blue-300/50 p-2 rounded-full w-10 h-10 text-center">
                            <UserSearch className="text-blue-800 "/></span>}
                        endContent={<ChevronRight className="text-blue-800 sm:block hidden"/>}
                        className={cssButton}
                >
                    <p className="font-semibold flex-1">Search</p>
                </Button>
            </div>
        );
    }

    return (
        <>
            {/* heading&search */}
            <div className="h-[80px] flex flex-col gap-5">
                {/* header */}
                <p className="font-bold text-xl"><NavLink to='/chat'>Chats</NavLink> <span
                    className="text-blue-200">({number})</span></p>
                <Input
                    type="email"
                    placeholder="search"
                    labelPlacement="outside"
                    size="sm"
                    startContent={
                        <Search className="text-stone-300 w-4"/>
                    }
                    variant="bordered"
                    className="bg-transparent"
                />
                {/* search */}
            </div>
            <Divider/>
            {/* list people */}
            <div className="flex-1 h-[100%] overflow-auto">
                {location.pathname.startsWith('/friend') ? (
                    <FriendPage/>
                ) : (
                    <ListFriendSideBar/>
                )}
            </div>
            <Divider/>
            {/* info&setting */}
            <div className="mb-2">
                <AuthButton/>
                {isAuthenticated() ?
                    <>
                        <FriendFunctionButton/>
                        <Button className="w-5 h-5 bg-transparent" isIconOnly><Settings
                            className="h-4 text-stone-400"/></Button>
                        <Button className="w-5 h-5 bg-transparent" isIconOnly><Info
                            className="h-4  text-stone-400"/></Button>
                    </> : <></>
                }
            </div>
        </>
    );
}
export default NaviticationBar