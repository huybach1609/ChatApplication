import LoginPage from '../components/auth/LoginPage'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {ProjectedRoute} from './ProjectedRouter';
import ChatPage from '../components/chat/ChatPage';
import Register from '../components/auth/Register';
import ChatRoom from "../test/TestSTOMP.jsx";
import {getUser} from "../utils/utils.jsx";
import FriendPage from "../components/friends/FriendPage.jsx";
import FriendRequest from "../components/friends/FriendRequest.jsx";
import SearchFriend from "../components/friends/SearchFriend.jsx";
import UserLayout from "../components/friends/UserLayout.jsx";

const CustomRouter = () => {
    const getUserName = () => {
        if (getUser()) {
            return JSON.parse(getUser()).username;
        }
    }
    return (
        <Routes>
            <Route path="/auth">
                <Route path="login" element={<LoginPage/>}/>
                <Route path="register" element={<Register/>}/>
            </Route>

            <Route path="/friends">
                <Route path="list" element={< FriendPage />}/>
                <Route path="search" element={<SearchFriend />} />
                <Route path="request" element={<FriendRequest />} />
            </Route>

            <Route path={getUserName()}>
                <Route path="info" element={<ProjectedRoute><UserLayout/></ProjectedRoute>}/>
            </Route>

            <Route path="/" element={<ProjectedRoute><UserLayout/></ProjectedRoute>}/>

            <Route path="/chatPage" element={<ProjectedRoute><ChatPage/></ProjectedRoute>}/>
            <Route path="/stomp" element={<ChatRoom/>}/>

            <Route path="chat">
                <Route path=":userId" element={<ProjectedRoute><ChatPage/></ProjectedRoute>}></Route>
            </Route>
        </Routes>
    )
}
export default CustomRouter;