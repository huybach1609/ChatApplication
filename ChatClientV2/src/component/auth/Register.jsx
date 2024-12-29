import {useAppContext} from "../contexts/AppContext.jsx";
import {Button, Field, Input, Link, makeStyles, Title3} from "@fluentui/react-components";
import {useMediaQuery} from "react-responsive";
import axios from "axios";
import {API_URL} from "../../../Constains.jsx";
import {useNavigate} from "react-router-dom";
import {useState} from "react";

const useStyles = makeStyles({
    inputField: {
        width: "400px",
        boxShadow: "var(--shadow10)",
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

export const Register = () => {
    const classes = useStyles()
    const isSm = useMediaQuery({query: '(min-width: 860px)'});
    const navigate = useNavigate();


    const handleRegister = (e) => {
        e.preventDefault();
        var data = {
            username: e.target.username.value,
            password: e.target.password.value,
            email: e.target.email.value,
            fullname: e.target.fullname.value
        }
        axios.post(API_URL + '/api/auth/register', data)
            .then(response => {
                // Handle success
                console.log('Response:', response.data);
                setTimeout(()=>{
                    navigate("/auth/login");
                },5000);
            })
            .catch(error => {
                // Handle error
            });
    }

    return (
        <>
            {/*input field*/}
            <div className={classes.inputField}>
                <form className={classes.form}>
                    <Title3 style={{marginBottom: "20px"}}>Create your account</Title3>
                    <Field
                        label="Username"
                        validationMessage=""
                        validationMessageIcon=""
                    >
                        <Input
                            type="text"
                            name="username"
                        />
                    </Field>
                    <Field
                        label="Full Name"
                        validationMessage=""
                        validationMessageIcon=""
                    >
                        <Input
                            type="text"
                            name="fullName"
                        />
                    </Field>
                    <Field
                        label="Email"
                        validationMessage=""
                        validationMessageIcon=""
                    >
                        <Input
                            type="email"
                            name="email"
                        />
                    </Field>
                    <Field
                        label="Password"
                        validationMessage=""
                        validationMessageIcon=""
                    >
                        <Input
                            type="password"
                            name="password"

                        />
                    </Field>
                    <Field
                        label="Re-enter password"
                        validationMessage=""
                        validationMessageIcon=""
                    >
                        <Input
                            type="password"
                            name="rekpassword"
                        />
                    </Field>
                    <Link>Already have your account ?</Link>
                    <div style={{display: "flex", justifyContent: 'right', gap: "20px", marginTop: "10px"}}>
                        <Button appearance="primary" type="submit">Submit</Button>
                        <Button type="reset">Clear</Button>
                    </div>
                </form>
            </div>
            {/*image*/}
            {isSm?
                <img style={{flexGrow:1,objectFit:"cover",height:"100vh", width:"200px"}} src="/src/assets/image/register_image.jpg" alt=""/>
                :
                null
            }
        </>
    );

}
