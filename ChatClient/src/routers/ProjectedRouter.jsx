import {Navigate} from "react-router-dom";
import { isAuthenticated } from "../utils/utils";

const ProjectedRoute = ({children}) => {
    if(!isAuthenticated()){
        return <Navigate to="/login" />
    }
    return children;
}
export default ProjectedRoute;