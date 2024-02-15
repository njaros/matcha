import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import axios from "axios";
import React, { useState, useEffect } from "react";

const ip = import.meta.env.VITE_IP;
const Axios = axios.create({
	baseURL: ip + ':5066'
})

const App: React.FC = () => {
	const [hello, setHello] = useState<string>("pouet");

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

	return (
		<div>{hello} + pouet</div>)
}

export default App