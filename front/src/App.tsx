import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import { Socket, io } from 'socket.io-client'

const ip = import.meta.env.VITE_IP;
const Axios = axios.create({
	baseURL: ip + ':5066'
})

const App: React.FC = () => {
	const { handleSubmit: handleSubmitMsg, register } = useForm()

	const sock = io(`http://127.0.0.1:5066/app2`)

	const onSubmit = (data: {message: string}) => {
		// Axios.get("/app1/test").then(
		// 	res => {
		// 		console.log(res)
		// 	}
		// )
	 	Axios.post("/app1/testPost", {message: data.message}).then(
			res => {
				console.log('Message received: ' + res.data)
			}
		).catch(
			err => {
				console.log(err)
		})
		//sock.emit("message", {message: data.message})
	}

	useEffect(() => {
		sock.on('res', (data: {str: string, str2: string, str3: string}) => {
			console.log(data.str);
		})

		// return (() => {
		// 	sock.off('res')})
	},[])

	return (
		<div>
			<h2>Send a message to the back</h2>
			<form onSubmit={handleSubmitMsg(onSubmit)}>
					<input
						type='text'
						placeholder="type your message..."
						autoComplete="off"
						{...register("message", {
							required: "enter message",
						})}
					/>
				<button type="submit">Send</button>
			</form>
		
		</div>)
}

export default App