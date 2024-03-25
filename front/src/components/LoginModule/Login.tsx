import { useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ILoginInForm } from "../../Interfaces";
import Axios from "../../tools/Caller";
import { cookieMan } from "../../tools/CookieMan";
import { storeRefresh } from "../../tools/Stores";
import { tokenReader } from "../../tools/TokenReader";

const Login: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
    const { register, handleSubmit } = useForm<ILoginInForm>();
	const [wrong, setWrong] = useState<boolean>(false);
	const setRefreshToken = storeRefresh(state => state.updateRefreshToken);

	const loginSubmit = (data: ILoginInForm) => {
		Axios.post("login", data)
			.then(response => {
				console.log(response);
				if (response.status == 200)
				{
					cookieMan.addCookie('token', response.data[0]);
					setRefreshToken(response.data[1]);
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

    const test = () => {
        Axios.get("/test").then(
            response => {
                console.log(response);
            }
        ).catch(
            error => {
                console.log(error);
            }
        )
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
            <button onClick={test}>test required_token button</button>
        </div>
    )
}

export default Login;