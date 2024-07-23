import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/utils";

export const ProjectedRoute = ({ children }) => {
    
    
    if (!isAuthenticated()) {
        return <Navigate to="/login" />
    }
    return children;
}
export const NoAuthRoute=({children})=>{
    if (isAuthenticated()) {
        return <Navigate to="/notfound" />
    }
    return children;
}
