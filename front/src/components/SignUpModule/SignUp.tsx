import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { ISignUpForm } from "../../Interfaces";
import Axios from "../../tools/Caller";

const Signup: React.FC = () => {
	const navigate = useNavigate();
	const signUpInput = useRef<HTMLInputElement>(null);
	const { register, handleSubmit } = useForm<ISignUpForm>();

	useEffect(() => {
		if (signUpInput.current)
		{
			signUpInput.current.focus();
		}
	}, [])

	const signupSubmit = (data: ISignUpForm) => {
		console.log(data);
		Axios.post("sign", data).then(
			response => {
				if (response.status == 200)
				{
					navigate("/login");	
				}
			}
		).catch(
			error => {
				console.log(error);
			}
		)
	}

	return (
		<div>
			<h1>SIGN UP PAGE</h1>
			<form className="signup_form" onSubmit={handleSubmit(signupSubmit)}>
				<input className="username_input"
                {...register("username", {required: true})}
                type="text"
				placeholder="Enter your username..." />
				<input className="email_input"
                {...register("email", {required: true})}
                type="text"
                placeholder="Enter your email..." />
                <input className="password_input"
                {...register("password", {required: true})}
                type="text"
                placeholder="Enter your password..." />
                <button className="submit_button" type="submit">SUBMIT</button>
			</form>
			<NavLink to="/login">Already registered ? Log In !</NavLink>
		</div>)
}

export default Signup;