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

	const sock = io(`http://127.0.0.1:5066`)

	const onSubmit = (data: {message: string}) => {
		console.log(data.message)
		Axios.get("").then(
			res => {
				console.log(res)
			}
		)
		sock.emit(data.message)
	}

	useEffect(() => {
		sock.on('res', (res: String) => {
			console.log('from front sock on')
			console.log(res);
		})
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