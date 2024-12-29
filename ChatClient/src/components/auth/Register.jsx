import axios from "axios";
import { useState } from "react";
import { API_URL } from "../../constrains";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [mess, setMess] = useState('');
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
                setMess("Register Successfull");
                setTimeout(()=>{
                    navigate("/auth/login");
                },5000);
            })
            .catch(error => {
                // Handle error
                setMess(error.response.data);
            });

    }
    var cssInput = "peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-1 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50";
    return (
        <div className="register ">

            <h2 className="text-xl font-bold my-5">Register Page</h2>
            <form method="post" onSubmit={handleRegister} className="mx-auto w-[30em] flex flex-col gap-5">

                <div className="flex gap-3"><nav>Username:</nav> <input type="text" name="username" className={cssInput} /></div>
                <div className="flex gap-3"> <nav>Password:</nav> <input type="password" name="password" className={cssInput} /></div>
                <div className="flex gap-3"> <nav>Email:</nav> <input type="email" name="email" className={cssInput} /></div>
                <div className="flex gap-3"> <nav>Full Name:</nav> <input type="text" name="fullname" className={cssInput} /></div>

                <div>{mess}</div>
                <div className="flex gap-5">
                    <button type="submit" className="btn ">Register</button>
                </div>
            </form>

        </div>
    );
}
export default Register;