import { useEffect, useRef, useState } from "react";
import { set, useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import { ILoginInForm } from "../../Interfaces";
import Axios from "../../tools/Caller";

const Login: React.FC = () => {
    const loginInput = useRef<HTMLInputElement>(null);
    const { register, handleSubmit } = useForm<ILoginInForm>();
    const [ wrong, setWrong ] = useState<boolean>(false);
    
    useEffect(() => {
        if (loginInput.current) {
            loginInput.current.focus();
        }
    }, [])

	const loginSubmit = async (data: ILoginInForm) => {
		console.log(data);
		Axios.post("login", { data })
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.log(error);
            setWrong(true);
        });
    }

    return (
        <div className="login_page">
            <h1>LOGIN PAGE</h1>
            <form className="login_form" onSubmit={handleSubmit(loginSubmit)}>
                <input className="username_input"
                {...register("username", {required: true})}
                type="text"
                placeholder="Enter your username..." />
                <input className="password_input"
                {...register("password", {required: true})}
                type="text"
                placeholder="Enter your password..." />
                {wrong && <div className="log_error">wrong username or password</div>}
                <button className="submit_button" type="submit">SUBMIT</button>
            </form>
            <NavLink to="/signup">Not registered ? Sign Up !</NavLink>
        </div>
    )
}

export default Login;