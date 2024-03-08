import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";

const ip = import.meta.env.VITE_IP;
const Axios = axios.create({
	baseURL: ip + ':5066'
})

const App: React.FC = () => {
	const [hello, setHello] = useState<string>("pouet");
	const [home, setHome] = useState<string>("not at home");
	const [atHome, setAtHome] = useState<boolean>(false);
	const [userName, setUserName] = useState<string>("");
	const [buildingUserName, setBuildingUserName] = useState<string>("");
	const [helloMsg, setHelloMsg] = useState<string>("");
	const { handleSubmit } = useForm<{}>({});

	useEffect(() => {
		Axios.get("helloworld").then(
			response => {
				console.log(response);
				setHello(response.data);
			}
			).catch(error => {
				console.log("error occured : " + error);
			})
	}, [])

	const homing = () => {
		if (!atHome)
		{
			Axios.get("").then(
				response => {
					setAtHome(true);
					setHome(response.data);
				}
			).catch(error => {
				console.log("error occured : " + error);
			})
		}
		else
		{
			Axios.get("leave").then(
				response => {
					setAtHome(false);
					setHome(response.data);
				}
			).catch(error => {
				console.log("error occured : " + error);
			})
		}
	}

	useEffect (() => {
		/*
		here can be define the parsing of the name the user has set
		*/
		Axios.get(userName).then(
			response => {
				setHelloMsg(response.data);
			}
		).catch(error => {
			console.log("error occured : " + error);
		})
	}, [userName])

	const changeUserName = () => {
		setUserName(buildingUserName);
	}

	const buildUserName = (event: React.ChangeEvent<HTMLInputElement>) => {
		setBuildingUserName(event.target.value);
	}

	return (
		<div>
			<div>{hello} + pouet</div>
			<button onClick={homing}>{home}</button>
			<form onSubmit={handleSubmit(changeUserName)}>
				<h2>set your name</h2>
				<input value={buildingUserName}
					type="text"
					onChange={buildUserName}
				/>
				<button type="submit">SUBMIT</button>
			</form>
			{userName !== "" ? <p> {helloMsg} </p> : null}
		</div>)
}

export default App