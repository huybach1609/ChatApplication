import {Divider, makeStyles, Persona, SearchBox, Text} from "@fluentui/react-components";
import {useLocation} from "react-router";
import {useNavigate} from "react-router-dom";
import {isAuthenticated} from "../auth/ApiUtils.jsx";
import {FriendDirection} from "../friend/FriendListNavBar.jsx";

const useStyles = makeStyles({
    searchField: {
        display: "flex",
        justifyItems: "center",
        justifyContent: "center",
        margin: "15px",
        height: "30px"
    },
    peopleCard: {
        padding: "20px",
        ":hover": {
            backgroundColor: "var(--colorNeutralBackground1Hover)"
        },
        "&.active": {
            backgroundColor: "var(--colorNeutralBackground1Selected)"
        },
        color: 'var(--colorNeutralForeground1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: "pointer"
    }
})
export const Navbar = () => {
    const classes = useStyles();
    const location = useLocation();
    const navigate = useNavigate();


    const AuthAction = () => {
        const isActive = (path) => {
            return location.pathname.startsWith(path);
        };

        return (
            <>
                <div className={`${classes.peopleCard} ${isActive("/auth/login") ? "active" : ""}`}
                     onClick={() => navigate("/auth/login")}
                >
                    <Persona
                        name={"Login"}
                        secondaryText="if you have account"
                        avatar={{
                            size: 48,
                            image: {}
                        }}
                    />
                </div>
                <div className={`${classes.peopleCard} ${isActive("/auth/register") ? "active" : ""}`}
                     onClick={() => navigate("/auth/register")}
                >
                    <Persona
                        name={"Register"}
                        secondaryText="if you dont have account"
                        avatar={{
                            size: 48,
                            image: {}
                        }}
                    />

                </div>
            </>

        );
    }

    return (
        <>
            {/*search field*/}
            <div className={classes.searchField}>
                <SearchBox style={{width: "100%"}}></SearchBox>
            </div>
            <Divider/>
            {/*component list*/}

            <div>
                {location.pathname.startsWith("/auth") || !isAuthenticated() ? (
                    <AuthAction/>
                ) : location.pathname.startsWith("/friends") ? (
                    <DefaultComponent/>
                ) : (
                    // Add other conditions or components as needed
                    <FriendDirection/>
                )}
            </div>
        </>

    )


}