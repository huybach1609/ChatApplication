import {useAppContext} from "../contexts/AppContext.jsx";
import {Button, Field, Input, Link, makeStyles, Title3} from "@fluentui/react-components";
import {useMediaQuery} from "react-responsive";
import {getToken, processLogin, setToken, setUserId} from "./ApiUtils.jsx";
import {useNavigate} from "react-router-dom";
import {useState} from "react";

const useStyles = makeStyles({
    inputField: {
        width: "400px",
        boxShadow: "var(--shadow8)",
        height: "100vh",
    },

    form: {
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        gap: "0px"
    },

    image: {}

});


export const Login = () => {
    const {loadUserInfo} = useAppContext();
    const classes = useStyles()
    const isSm = useMediaQuery({query: '(min-width: 860px)'});
    const navigate = useNavigate();

    const [usernameValidation, setUsernameValidation] = useState({ message: '', state: '' });
    const [passwordValidation, setPasswordValidation] = useState({ message: '', state: '' });

    const load = async () => {
        await loadUserInfo();
    }


    const handleLogin = async (event) => {
        event.preventDefault();
        var username = event.target.username.value;
        var password = event.target.password.value;

        processLogin(username, password)
            .then(response => {
                console.log(response);
                // var status = response.status;
                if (response.status === 200) {
                    setToken(response.data.jwt);
                    setUserId(response.data.message);
                    load();
                    navigate("/");
                }
            }).catch(error => {
            if (error.response.data.jwt === "0") {
                console.log(error.response.data.message);
                setUsernameValidation({
                    message: 'Invalid username',
                    state: 'error',
                });
                setPasswordValidation({
                    message: '',
                    state: '',
                });
            } else {
                setUsernameValidation({
                    message: '',
                    state: '',
                });
                setPasswordValidation({
                    message: 'Invalid password',
                    state: 'error',
                });
            }
        });
    }


    return (
        <>
            {/*input field*/}
            <div className={classes.inputField}>
                <form className={classes.form} onSubmit={handleLogin}>
                    <Title3 style={{marginBottom: "20px"}}>Login</Title3>
                    <Field
                        label="Username"
                        validationMessage={usernameValidation.message}
                        validationState={usernameValidation.state}
                    >
                        <Input
                            type="text"
                            name="username"
                        />
                    </Field>
                    <Field
                        label="Password"
                        validationMessage={passwordValidation.message}
                        validationState={passwordValidation.state}
                    >
                        <Input
                            type="password"
                            name="password"
                        />
                    </Field>
                    <Link>Forgot you password?</Link>
                    <div style={{display: "flex", justifyContent: 'right', gap: "20px", marginTop: "10px"}}>
                        <Button appearance="primary" type="submit">Login</Button>
                        <Button type="reset">Clear</Button>
                    </div>
                </form>
            </div>
            {/*image*/}
            {isSm ?
                <img style={{flexGrow: 1, objectFit: "cover", height: "100vh", width: "200px"}}
                     src="/src/assets/image/login_image.jpg" alt=""/>
                :
                null
            }
        </>
    );
}