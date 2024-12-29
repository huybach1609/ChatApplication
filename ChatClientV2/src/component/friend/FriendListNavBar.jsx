import {useEffect, useState} from "react";
import {getListFriend} from "./friendAPI.jsx";
import {makeStyles, Persona, Text} from "@fluentui/react-components";
import {useNavigate} from "react-router-dom";

const useStyles = makeStyles({
    peopleCard: {
        padding: "20px",
        ":hover": {
            backgroundColor: "var(--colorNeutralBackground1Hover)"
        },
        "&.active": {
            backgroundColor: "var(--colorNeutralStroke3)"
        },
        ":active" : {
            backgroundColor: "var(--colorNeutralStroke2)"
        },
        color: 'var(--colorNeutralForeground1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: "pointer"
    }
});


export const FriendDirection = () => {
    const classes = useStyles();
    const [listFriend, setListFriend] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const load= async ()=>{
            const data = await getListFriend();
            setListFriend(data);
        }
        load();
       console.log("navigate");
    }, []);

    const isActive = (path) => {
        return location.pathname.startsWith(path);
    };

    return (
        <>
            {listFriend ?
                listFriend.map((item, index) => (
                    <div className={`${classes.peopleCard} ${isActive(`/chat/${item.username}`) ? "active" : ""}`} key={index} onClick={()=> navigate(`/chat/${item.username}`)}
                    >
                        <Persona
                            name={item.fullName ? item.fullName : item.username}
                            secondaryText="asdf sadf "
                            presence={{status: "available"}}
                            avatar={{
                                size: 48,
                                image: {
                                    src: item.picture
                                }
                            }}
                        />
                        <Text size={200}>
                            11:20
                        </Text>
                    </div>
                ))
                :
                <>loading</>
            }
        </>
    );
}