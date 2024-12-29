import {createContext, useContext, useState} from "react";
import {FluentProvider, webDarkTheme, webLightTheme} from "@fluentui/react-components";
import {ACCESS_TOKEN} from "../../../Constains.jsx";
import {clearJwt, getCurrentUser} from "../auth/ApiUtils.jsx";
import {useNavigate} from "react-router-dom";

export const AppContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => useContext(AppContext);


// eslint-disable-next-line react/prop-types
export const AppProvider = ({children}) => {

    const getThemeLocal = () => {
        return localStorage.getItem("theme");
    }

    const setThemeLocal = (value) => {
        localStorage.setItem("theme", value.toString()); // Store as string
    }

    const [theme, setTheme] = useState(getThemeLocal() === '1' ? webDarkTheme : webLightTheme);

    const toggleTheme = () => {
        const themeLocal = parseInt(getThemeLocal(), 10); // Convert to integer for comparison

        if (themeLocal === 1) {
            setTheme(webLightTheme);
            setThemeLocal(0);
        } else {
            setTheme(webDarkTheme);
            setThemeLocal(1);
        }
    }

    const userData =
        {
            id: "38683e47-5379-35e4-8dac-464d643a0073",
            username: "huybach",
            email: "bach@gmail.com",
            fullName: "Huy Bách",
            picture: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-DXHqgpV5MK_KDIL4PnsY_c65tkva-gCK7g&s"
        }

    const [user, setUser] = useState(null);

    const loadUserInfo = async ()=>{
        const request = await getCurrentUser();
        console.log(request);
        setUser(request.data);
    }
    const signOut=()=>{
       clearJwt();
       setUser(null);
    }

    return (
        <AppContext.Provider value={{user, loadUserInfo , theme, toggleTheme, signOut}}>
            <FluentProvider theme={theme}>
                {children}
            </FluentProvider>
        </AppContext.Provider>
    );
}