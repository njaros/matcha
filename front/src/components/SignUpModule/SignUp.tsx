import { useState } from "react";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker"
import { NavLink, useNavigate } from "react-router-dom";
import { ISignUpForm } from "../../Interfaces";
import { Box, Select, Text, Flex, Input } from "@chakra-ui/react"
import Axios from "../../tools/Caller";
import "react-datepicker/dist/react-datepicker.css";
import { TbEscalator } from "react-icons/tb";

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
		form.append("birthDate", birthDate.toISOString().substring(0, 10));
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
		<Flex 
			flexDir={'column'} 
			alignItems={'center'}
			justifyContent="center"
			paddingTop={'15px'}
		>
			
			<Text
				marginTop={'20px'}
				fontSize={'x-large'} 
				fontWeight={'bold'}
			>
				Create your account
			</Text>
			<Flex paddingBottom={'20px'}>
				<Text 
					fontSize={'small'}
					paddingRight={'5px'}
				>
					Already have an account ? 
				</Text>
				<NavLink 
					to={'/login'}
				>
					<Text 
						fontSize={'small'}
						textColor={'#A659EC'}
					>
						Sign in here
					</Text>
				</NavLink>
			</Flex>
			<form className="signup_form" onSubmit={handleSubmit(signupSubmit)}>
				<Box w={'90%'}>
					<Text paddingLeft={'10px'}>Username</Text>
					<Box padding={'0px 10px 10px'}>
						<Input
							className="username_input"
							{...register("username", {required: true})}
							type="text"
							placeholder="John doe" 
						/>
					</Box>
					<Input 
						className="email_input"
						{...register("email", {required: true})}
						type="text"
						placeholder="Enter your email..." />
					<Input 
						className="password_input"
						{...register("password", {required: true})}
						type="password"
						placeholder="Enter your password..." />
					<Select
					placeholder="Your gender"
					size='lg'
					{...register("gender", {required: true})}>
						<option value="man">man</option>
						<option value="woman">woman</option>
						<option value="non-binary">non-binary</option>
					</Select>
					<Select
					placeholder="Your preference"
					size='lg'
					{...register("preference", {required: true})}>
						<option value="man">man</option>
						<option value="woman">woman</option>
						<option value="non-binary">non-binary</option>
						<option value="man-woman">man or woman</option>
						<option value="man-nb">man or non-binary</option>
						<option value="woman-nb">woman or non-binary</option>
						<option value="all">no preference</option>
					</Select>
					<DatePicker selected={birthDate} onChange={(date: Date)=>{setBirthDate(date)}} dateFormat="dd/MM/yyyy" />
					<button className="submit_button" type="submit">SUBMIT</button>
				</Box>
			
			</form>
			{ errorMsg != "" && <p> {errorMsg} </p> }
		</Flex>)
}

export default Signup;