import LoginPage from '../components/auth/LoginPage'
import Info from '../components/auth/ProjectedPage'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ProjectedRoute } from './ProjectedRouter';
import CheckConnection from '../components/websocket/connection';
import ChatPage from '../components/chat/ChatPage';

const CustomRouter = () => {
    return (
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<ProjectedRoute><Info /></ProjectedRoute>} />
                <Route path="/info" element={<ProjectedRoute><Info /></ProjectedRoute>} />
                <Route path="/chatPage" element={<ProjectedRoute><ChatPage /></ProjectedRoute>} />
                <Route path="chat">
                    <Route path=":userId" element={<ChatPage />}></Route>
                </Route>
            </Routes>
    )
}
export default CustomRouter;