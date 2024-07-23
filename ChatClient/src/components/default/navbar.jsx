import { isAuthenticated, clearJwt } from "../../utils/utils";
import { Divider, Input, Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Popover, PopoverTrigger, PopoverContent, ScrollShadow } from "@nextui-org/react";
import { Info, Search, Settings, UserRound } from "lucide-react";
import ListFriendSideBar from "../chat/ListFriend";

const NaviticationBar = () => {
    const number = 2;
    const authButton = (
        <Popover
            showArrow
            offset={10}
            placement={"left"}
            backdrop="blur"
        >
            <PopoverTrigger>
                <Button variant="flat" className="capitalize">
                    auth
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[150px]">
                {isAuthenticated() ?
                    <button onClick={clearJwt}>logout</button>
                    :
                    <a href="/login">Sign in</a>
                }
            </PopoverContent>
        </Popover>

    );
    return (
        <>
            {/* heading&search */}
            <div className="h-[80px] flex flex-col gap-5">
                {/* header */}
                <p className="font-bold text-xl">Chats <span className="text-blue-200">({number})</span></p>
                <Input
                    type="email"
                    placeholder="search"
                    labelPlacement="outside"
                    size="sm"
                    startContent={
                        <Search className="text-stone-300 w-4" />
                    }
                    variant="bordered"
                    className="bg-transparent"
                />
                {/* search */}
            </div>
            <Divider />
            {/* listpeople */}
                <div className="flex-1 h-[100%] overflow-auto">
                    <ListFriendSideBar />
                </div>
            <Divider />
            {/* info&setting */}
            <div >
                <Button className="w-5 h-5 bg-transparent" isIconOnly><Settings className="h-4 text-stone-400" /></Button>
                <Button className="w-5 h-5 bg-transparent" isIconOnly><Info className="h-4  text-stone-400" /></Button>
                <Button className="w-5 h-5 bg-transparent" isIconOnly><UserRound className="h-4  text-stone-400" /> </Button>
            </div>
        </>

        // <Navbar>
        //     <NavbarBrand>
        //         <a href="/" className="font-bold text-inherit"></a>
        //     </NavbarBrand>
        //     <NavbarContent className="hidden sm:flex gap-4" justify="center">

        //         <NavbarItem isActive>
        //             <Link href="/info" aria-current="page">
        //                 info
        //             </Link>
        //         </NavbarItem>
        //         <NavbarItem>
        //             <Link color="foreground" href="/chat">
        //                 chat
        //             </Link>
        //         </NavbarItem>
        //         <NavbarItem >
        //             <Link href="/chatPage" aria-current="page">
        //                 chatPage
        //             </Link>
        //         </NavbarItem>
        //     </NavbarContent>
        //     <NavbarContent justify="end">
        //         {/* <NavbarItem className="hidden lg:flex">
        //             <Link href="#">Login</Link>
        //         </NavbarItem> */}
        //         <NavbarItem>
        //             {authButton}

        //         </NavbarItem>
        //     </NavbarContent>
        // </Navbar>
    );
}
export default NaviticationBar