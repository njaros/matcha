import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { ILoginInForm } from "../../Interfaces";
import Axios from "../../tools/Caller";
import { cookieMan } from "../../tools/CookieMan";

const Login = (props:{
    handleLog: (newState: boolean) => void,
    handleAccess: (newAccess: string) => void}) =>
{
	const navigate = useNavigate();
	const location = useLocation();
    const { register, handleSubmit } = useForm<ILoginInForm>();
	const [wrong, setWrong] = useState<boolean>(false);

	const loginSubmit = (data: ILoginInForm) => {
		Axios.post("login", data, {withCredentials: true})
			.then(response => {
				console.log(response);
				if (response.status == 200)
				{
					cookieMan.addCookie('token', response.data.access_token);
                    props.handleAccess(response.data.access_token);
                    props.handleLog(true);
					const from = (location.state as any)?.from || "/";
					navigate(from);
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
        </div>
    )
}

export default Login;