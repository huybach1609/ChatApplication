import {useParams} from "react-router";
import {Avatar,  Divider,  makeStyles, Spinner, Subtitle1 } from "@fluentui/react-components";
import {useEffect,  useState} from "react";
import {getInfoUser} from "../friend/friendAPI.jsx";
import {MessageViewComponent} from "./MessageViewComponent.jsx";

const useStyles = makeStyles({
    chatLayout: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
    },
    headChat: {
        width: "100%",
        height: "60px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
    },
    messageView: {
        width: "100%",
        flexGrow: 1
    },
    inputView: {
        width: "100%",
        height: "60px",
        display: "flex",
        justifyContent: "center"
    },
    inputMessage: {
        width: "90%",
        height: "40px"
    },
    icon: {
        ":hover": {
            color: "var(--colorNeutralForeground2BrandHover)"
        },
        ":active": {
            color: "var(--colorNeutralForeground2BrandPressed)"
        }
    }

});
export const ChatPage = () => {
    const classes = useStyles();
    const {username} = useParams();

    const [userTarget, setUserTarget] = useState(null);


    useEffect(() => {
        const target = async () => {
            const response = await getInfoUser(username);
            setUserTarget(response);
        }
        target();
    }, [username]);

    if (!userTarget) {
        return <Spinner/>;
    }


    return (

        <div className={classes.chatLayout}>
            {/*heading*/}
            <div>
                <div className={classes.headChat}>
                    <Avatar
                        image={{
                            src: userTarget.picture
                        }}
                        size={40}
                        style={{
                            marginLeft: "20px"
                        }}
                        name={userTarget.fullName ? userTarget.fullName: userTarget.username}

                    />
                    <Subtitle1>{userTarget.fullName ? userTarget.fullName: userTarget.username}</Subtitle1>
                </div>

                <Divider/>
            </div>
            <MessageViewComponent target={userTarget}/>

        </div>
    )
}
