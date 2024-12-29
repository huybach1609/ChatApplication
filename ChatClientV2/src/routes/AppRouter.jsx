import {Routes, Route} from "react-router";
import {Login} from "../component/auth/Login.jsx";
import {Register} from "../component/auth/Register.jsx";
import {ChatPage} from "../component/chat/ChatPage.jsx";

export const AppRouter =()=>{
    return(
        <Routes>
            <Route path="/auth">
                <Route path="login" element={<Login/>}/>
                <Route path="register" element={<Register/>}/>
            </Route>
            <Route path="chat">
               <Route path=":username" element={<ChatPage/>}/>
            </Route>
            {/*<Route path="/" element={} />*/}
        </Routes>
    );

}