import { Routes, Route, BrowserRouter, Navigate, useNavigate } from "react-router-dom";
import ProtectedRoutes from "./components/ProtectedRoutes"
import Layout from "./components/LayoutModules/Layout";
import { readPayload, tokenReader, getToken} from "./tools/TokenReader";
import { useEffect, useState } from "react";
import { Socket, io } from 'socket.io-client';
import { storeSocket } from "./tools/Stores";
import Login from "./components/LoginModule/Login";
import Signup from "./components/SignUpModule/SignUp";
import Home from "./components/HomeModule/Home";
import Profile from "./components/ProfileModule/Profile";
import Conversation from "./components/ConversationModule/Conversation";
import Swipe from "./components/SwipeModule/Swipe";

function App() {

	// const [socket, setSocket] = useState<Socket>(null)
	const [userId, setUserId] = useState("")
	const { socket, updateSocket } = storeSocket()

	const getUserId = () => {
		setUserId(tokenReader.getAttrAsString(getToken(), "user_id"));
	}

	useEffect(() => {

		getUserId()
		console.log('userId: ', userId)
		if (!userId || userId.length <= 0)
			return
		console.log('test')
		updateSocket(io(`http://127.0.0.1:5066`, {
			query : {
				userId : userId,
				token : getToken()
			}
		}))

	},[userId]) 

	return (
		<div className="App">
			<BrowserRouter>
				<Routes>
					<Route element={ <Layout /> }>
						<Route path="/login" element={ tokenReader.isLogged() ? <Navigate to="/" /> : (<Login />) } />
						<Route path="/signUp" element={ tokenReader.isLogged() ? <Navigate to="/" /> : (<Signup />) } />
						<Route element={<ProtectedRoutes />}>
							<Route path="/" element={ <Home />} />
							<Route path="/profile" element={ <Profile />} />
							<Route path="/conversation" element={ <Conversation />} />
							<Route path="/swipe" element={ <Swipe/> } />
						</Route>
					</Route>
				</Routes>
			</BrowserRouter>
		</div>
		)
}

export default App