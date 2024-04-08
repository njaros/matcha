import { useState } from "react";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker"
import { useNavigate } from "react-router-dom";
import { ISignUpForm } from "../../Interfaces";
import Axios from "../../tools/Caller";
import "react-datepicker/dist/react-datepicker.css";

const Signup: React.FC = () => {
	const navigate = useNavigate();
	const { register, handleSubmit } = useForm<ISignUpForm>();
	const [ errorMsg, setErrorMsg ] = useState<string>("");
	const [ birthDate, setBirthDate ] = useState<Date>(new Date());

	const signupSubmit = (data: ISignUpForm) => {
		const form = new FormData();
		form.append("username", data.username);
		form.append("email", data.email);
		form.append("password", data.password);
		form.append("birthdate", birthDate.toISOString().substring(0, 10));
		form.append("gender", data.gender);
		form.append("preference", data.preference);

		console.log(birthDate.toISOString().substring(0, 10));

		Axios.post("sign", form).then(
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
				if (error.response)
				{
					if (error.response.status == 400)
						setErrorMsg(error.response.data.message);
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
				<input className="gender_input"
                {...register("gender", {required: true})}
                type="text"
				placeholder="Enter your gender..." />
				<input className="preference_input"
                {...register("preference", {required: true})}
                type="text"
				placeholder="You are searching for..." />
				<DatePicker selected={birthDate} onChange={(date: Date)=>{setBirthDate(date)}} dateFormat="dd/MM/yyyy" />
                <button className="submit_button" type="submit">SUBMIT</button>
			</form>
			{ errorMsg != "" && <p> {errorMsg} </p> }
		</div>)
}

export default Signup;