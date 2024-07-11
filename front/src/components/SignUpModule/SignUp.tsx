import { useState } from "react";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker"
import { NavLink, useNavigate } from "react-router-dom";
import { ISignUpForm } from "../../Interfaces";
import { Box, Select, Text, Flex, Input, Stack, Button } from "@chakra-ui/react"
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
					console.warn(error)
					if (error.response.status == 400 || error.response.status == 413)
						setErrorMsg(error.response.data.message);
					else
						setErrorMsg("unhandled error");
				}
				else
					setErrorMsg("server didn't answered...");
			}
		)
	}

	const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const dateValue = event.target.value;
		const date = new Date(dateValue);
		setBirthDate(date);
	  };

	return (
		<Flex 
			flexDir={'column'} 
			alignItems={'center'}
			justifyContent="center"
			h={'100%'}
			w={'100%'}
		>
			
			<Text
				fontSize={'x-large'} 
				fontWeight={'bold'}
			>
				Create your account
			</Text>
			<Flex paddingBottom={'30px'}>
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
				<Stack spacing={2} >
					<Input
						borderRadius={'full'}
						className="username_input"
						{...register("username", {required: true})}
						type="text"
						placeholder="Your username" 
					/>
					<Input
						borderRadius={'full'}
						className="email_input"
						{...register("email", {required: true})}
						type="text"
						placeholder="Your mail" 
					/>
					<Input
						borderRadius={'full'}
						className="password_input"
						{...register("password", {required: true})}
						type="password"
						placeholder="Your password" 
					/>
					<Select
						borderRadius={'full'}
						placeholder="Select your gender"
						{...register("gender", {required: true})}>
							<option value="man">man</option>
							<option value="woman">woman</option>
					</Select>
					<Select
						borderRadius={'full'}
						placeholder="Select your preference"
						{...register("preference", {required: true})}>
							<option value="man">man</option>
							<option value="woman">woman</option>
							<option value="all">all</option>
					</Select>
					<Input 
						aria-label="Date"
						title="dawdwa" 
						type="date" 
						onChange={handleDateChange}
						borderRadius={'full'}
					/>
					<Button 
						className="submit_button"
						type="submit"
						bg="#A659EC"
						textColor={'white'}
						borderRadius={'full'}
						w={'300px'} //pq ca change la taille pour tout ?
					>
						Create account
					</Button>
				</Stack>
			
			
			</form>
			{ errorMsg != "" && <p> {errorMsg} </p> }
		</Flex>)
}

export default Signup