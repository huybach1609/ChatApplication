import LoginPage from '../components/auth/LoginPage'
import Info from '../components/auth/ProjectedPage'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProjectedRoute from './ProjectedRouter';

const CustomRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/info" element={<ProjectedRoute><Info /></ProjectedRoute>} />
            </Routes>
        </Router>
    )
}
export default CustomRouter;