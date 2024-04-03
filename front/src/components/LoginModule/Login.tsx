import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { ILoginInForm } from "../../Interfaces";
import Axios from "../../tools/Caller";
import { cookieMan } from "../../tools/CookieMan";
import { storeRefresh } from "../../tools/Stores";

const Login: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
    const { register, handleSubmit } = useForm<ILoginInForm>();
	const [wrong, setWrong] = useState<boolean>(false);
	const setRefreshToken = storeRefresh(state => state.updateRefreshToken);

	const loginSubmit = (data: ILoginInForm) => {
        const form = new FormData();
        form.append("username", data.username);
        form.append("password", data.password);
		Axios.post("login", form)
			.then(response => {
				console.log(response);
				if (response.status == 200)
				{
					cookieMan.addCookie('token', response.data.access_token);
					setRefreshToken(response.data.refresh_token);
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