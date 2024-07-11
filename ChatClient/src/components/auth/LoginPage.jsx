import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { setToken, processLogin } from "../../utils/utils";
import { OAUTH2_REDIRECT_URI} from "../../constrains";


const LoginPage = () => {

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        if (code) {
            setToken(code);
            window.location.href = '/info';
        }
    }, []);

    const handleGoogleLogin = () => {
        // set the redirect URI cookie
        const redirectUri = window.location.origin + '/login';
        Cookies.set('redirect_uri', redirectUri, { path: '/' });
        window.location.href = OAUTH2_REDIRECT_URI;
    };

    const handleLogin = (event) => {
        event.preventDefault();
        var username = event.target.username.value;
        var password = event.target.password.value;

        processLogin(username, password)
            .then(response => {
                console.log(response);
                var status = response.status;
                if (status < 300) {
                    console.log("goes here 1");
                    return response.data;
                }
            }).then(data => {
                setToken(data.jwt);
                window.location.href = "/login?code=" + data.jwt;
            }).catch(error => {
                console.log(error);
                console.log("goes here 2");
                SetMess(error.response.data.message);
            });
    }
    const [mess, SetMess] = useState("");

    var cssInput = "peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-1 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50";

    return (
        <div>
            <h2 className="text-xl font-bold my-5">Login Page</h2>
            <form method="post" onSubmit={handleLogin} className="mx-auto w-[30em] flex flex-col gap-5">

                <div className="flex gap-3"><nav>Username:</nav> <input type="text" name="username" className={cssInput} /></div>
                <div className="flex gap-3"> <nav>Password:</nav> <input type="password" name="password" className={cssInput} /></div>

                <div>{mess}</div>
                <div className="flex gap-5">
                    <button type="submit" className="btn ">Login</button>
                    <button type="button" className="btn" onClick={handleGoogleLogin}> Google</button>
                </div>
            </form>
        </div>
    )
}
export default LoginPage;
