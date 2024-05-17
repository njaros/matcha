import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { ILoginInForm } from "../../Interfaces";
import Axios from "../../tools/Caller";
import { cookieMan } from "../../tools/CookieMan";
import { storeGps } from "../../tools/Stores";
import { Box, Spinner } from "@chakra-ui/react";

const Login = (props:{
    handleLog: (newState: boolean) => void,
    handleAccess: (newAccess: string) => void}) =>
{
	const navigate = useNavigate();
	const location = useLocation();
    const { register, handleSubmit } = useForm<ILoginInForm>();
	const [wrong, setWrong] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { gps, updateGpsLatLng } = storeGps();
    const { fixed, updateGpsFixed } = storeGps();

	const loginSubmit = (data: ILoginInForm) => {
        setLoading(true);
        if (gps != undefined)
        {
            data.latitude = gps.latitude;
            data.longitude = gps.longitude;
        }
		Axios.post("login", data, {withCredentials: true})
			.then(response => {
				console.log(response);
				if (response.status == 200)
				{
					cookieMan.addCookie('token', response.data.access_token);
                    console.log(response.data);
                    updateGpsLatLng({
                        latitude: response.data.latitude,
                        longitude: response.data.longitude
                    });
                    updateGpsFixed(response.data.gpsfixed);
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
        })
        .finally(() => {
            setLoading(false);
        });
    }

    return (
        <Box flexGrow={1} className="login_page">
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
                {loading ?
                <Spinner color="purple" size="lg"/> :
                <button className="submit_button" type="submit">SUBMIT</button>}
            </form>
        </Box>
    )
}

export default Login;