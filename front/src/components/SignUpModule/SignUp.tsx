import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { ISignUpForm } from "../../Interfaces";
import Axios from "../../tools/Caller";

const Signup: React.FC = () => {
	const navigate = useNavigate();
	const signUpInput = useRef<HTMLInputElement>(null);
	const { register, handleSubmit } = useForm<ISignUpForm>();
	const [ errorMsg, setErrorMsg ] = useState<string>("");

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
				if (response.status == 201)
				{
					navigate("/login");	
				}
				else 
				{
					setErrorMsg("something wrong happened");	
				}
			}
		).catch(
			error => {
				console.log(error);
				if (error.response)
				{
					if (error.response.status == 409)
						setErrorMsg("username already exists");
					else
						setErrorMsg("unhandled error");
				}
				else
					setErrorMsg("server didn't answered...");
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
			{ errorMsg != "" && <p> {errorMsg} </p> }
			<NavLink to="/login">Already registered ? Log In !</NavLink>
		</div>)
}

export default Signup;