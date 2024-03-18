import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoutes from "./components/ProtectedRoutes"
import Layout from "./components/Layout"
import { tokenReader } from "./tools/TokenReader";
import Login from "./components/LoginModule/Login";
import Signup from "./components/SignUpModule/SignUp";

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<Routes>
					<Route element={<Layout />}>
						<Route path="/login" element={ tokenReader.isLogged() ? <Navigate to="/" /> : <Login />} />
						<Route path="/signUp" element={ tokenReader.isLogged() ? <Navigate to="/" /> : <Signup />}/>
						<Route element={<ProtectedRoutes />}>
							<Route path="/" element={ <Home />} />
						</Route>
					</Route>
				</Routes>
			</BrowserRouter>
		</div>
		)
}

export default App