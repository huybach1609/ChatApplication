import {
    Button,
    webDarkTheme,
    Menu,
    MenuTrigger,
    MenuPopover,
    MenuList,
    MenuItem,
    Avatar, Link, Persona, makeStyles
} from "@fluentui/react-components";
import {useNavigate} from "react-router-dom";
import {getToken, isAuthenticated} from "../auth/ApiUtils.jsx";
import {useAppContext} from "../contexts/AppContext.jsx";
import {Link16Regular, People20Regular} from '@fluentui/react-icons';
import {useEffect, useState} from "react";

const useStyles = makeStyles({
    iconSidebar: {
        display: "flex",
        justifyContent: "center",
        padding: "7px",
        borderRadius: "100px",
        color: "var(--colorBrandForegroundOnLightHover)",
        backgroundColor: "var(--colorNeutralBackground1)",
        ":hover":{
            backgroundColor: "var(--colorBrandForegroundOnLightHover)",
            color: "var(--colorNeutralBackground1Hover)"
        },
        ":active":{
            backgroundColor: "var(--colorBrandForegroundOnLightPressed)"
        }
    }
});

export const Sidebar = () => {
    const classes = useStyles();
    const navigate = useNavigate();
    const {user, theme, toggleTheme, loadUserInfo, signOut} = useAppContext();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkData = async () => {
            const token = getToken();
            if (!user && token) {
                await loadUserInfo();
                setIsLoading(false);
            } else if (!isAuthenticated()) {
                setIsLoading(false);
            } else {
                setIsLoading(false);
            }
        };
        checkData();
    }, [loadUserInfo, user]);

    if (isLoading) {
        return <p>loading...</p>

    }

    const AuthSidebar = () => {

        const logOut = () => {
            signOut();
            navigate("/auth/login")
        }

        return (
            <div style={{display: "flex", gap: "10px", flexDirection: "column"}}>

                <Menu>
                    <MenuTrigger disableButtonEnhancement>
                        <Avatar name={user.username} badge={{status: "available"}}
                                image={{
                                    src: user.picture
                                }}
                        />

                    </MenuTrigger>

                    <MenuPopover style={{width: "400px"}}>
                        <div style={{margin: "10px"}}>
                            <div style={{display: "flex", justifyContent: "right",}}><Link onClick={logOut}>Sign
                                out</Link></div>
                            <Persona
                                size="huge"
                                name={"@" + user.username}
                                secondaryText={user.fullName}
                                tertiaryText={(
                                    <Link>View account<Link16Regular/></Link>

                                )}
                                presence={{status: "available"}}
                                avatar={{
                                    image: {
                                        src: user.picture
                                    },
                                }}
                            />
                        </div>
                        <MenuList>
                            <MenuItem>New </MenuItem>
                            <MenuItem>New Window</MenuItem>
                            <MenuItem disabled>Open File</MenuItem>
                            <MenuItem>Open Folder</MenuItem>
                        </MenuList>
                    </MenuPopover>
                </Menu>
                <div className={classes.iconSidebar} onClick={() => navigate("/friend/list")}><People20Regular/></div>
            </div>
        );
    }

    return (
        <>
            {
                user ?
                    <AuthSidebar/>
                    :
                    <Button
                        appearance={"subtle"}

                        onClick={() => navigate("/auth/login")}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                 stroke-linecap="round" stroke-linejoin="round"
                                 className="lucide lucide-key-round">
                                <path
                                    d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/>
                                <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/>
                            </svg>
                        }></Button>
            }
            <Button
                appearance={"subtle"}
                onClick={toggleTheme}
                icon={theme === webDarkTheme ?
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                         class="lucide lucide-sun-medium">
                        <circle cx="12" cy="12" r="4"/>
                        <path d="M12 3v1"/>
                        <path d="M12 20v1"/>
                        <path d="M3 12h1"/>
                        <path d="M20 12h1"/>
                        <path d="m18.364 5.636-.707.707"/>
                        <path d="m6.343 17.657-.707.707"/>
                        <path d="m5.636 5.636.707.707"/>
                        <path d="m17.657 17.657.707.707"/>
                    </svg>
                    :
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                         fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                         stroke-linejoin="round" className="lucide lucide-moon">
                        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                    </svg>
                }
            ></Button>
        </>
    );
}