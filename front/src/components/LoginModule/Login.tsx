import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { ILoginInForm } from "../../Interfaces";
import Axios from "../../tools/Caller";
import { cookieMan } from "../../tools/CookieMan";
import { store } from "../../tools/Stores";

const Login: React.FC = () => {
	const navigate = useNavigate();
    const loginInput = useRef<HTMLInputElement>(null);
    const { register, handleSubmit } = useForm<ILoginInForm>();
	const [wrong, setWrong] = useState<boolean>(false);
	const setRefreshToken = store(state => state.updateRefreshToken)
    
    useEffect(() => {
        if (loginInput.current) {
            loginInput.current.focus();
        }
    }, [])

	const loginSubmit = (data: ILoginInForm) => {
		console.log(data);
		Axios.post("login", data)
			.then(response => {
				console.log(response);
				if (response.status == 200)
				{
					cookieMan.addCookie('token', response.data[0]);
					setRefreshToken(response.data[1]);
					navigate("/");
				}
				else
				{
					setWrong(true);
				}
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