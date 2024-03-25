import { Routes, Route, BrowserRouter, Navigate, useNavigate } from "react-router-dom";
import ProtectedRoutes from "./components/ProtectedRoutes"
import Layout from "./components/LayoutModules/Layout"
import { tokenReader } from "./tools/TokenReader";
import Login from "./components/LoginModule/Login";
import Signup from "./components/SignUpModule/SignUp";
import Home from "./components/HomeModule/Home";
import Profile from "./components/ProfileModule/Profile";
import Conversation from "./components/ConversationModule/Conversation";
import Swipe from "./components/SwipeModule/Swipe";

function App() {

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