import {useEffect, useState} from "react";
import {clearJwt, getCurrentUser, getToken, getUser, setUserId, setUserLog} from "../../utils/utils.jsx";
import { Button } from "@fluentui/react-components";


const UserLayout = () => {
    const [user, setUser] = useState(null);
    const [check, setCheck] = useState("");

    useEffect(() => {
        const token = getToken();
        if (getUser() != null) {
            setUser(JSON.parse(getUser()));
        } else {
            if (token) {
                getCurrentUser()
                    .then((response) => {
                        console.log(response.data);
                        setUser(response.data);
                        setUserLog(JSON.stringify(response.data));
                        setUserId(response.data.id);
                    })
                    .catch((error) => {
                        console.log('Error fetching protected data:', error);
                        console.log(error.response.data.error + " " + error.response.status)
                        setCheck(error.response.data.error);
                    });
            }
        }

    }, []);

    if (check) {
        return <div>{check}</div>
    }

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div>
                <p>Welcome, {user.email}</p>

                <img src={user.picture} className='w-10 h-10' />
            </div>
            <div>
                <Button onClick={clearJwt}>LogOut</Button>
            </div>
        </div>
    );
}
export default UserLayout;