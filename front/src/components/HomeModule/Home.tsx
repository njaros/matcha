import { useNavigate } from "react-router-dom"
import { cookieMan } from "../../tools/CookieMan"

const Home: React.FC = () => {
	const navigate = useNavigate();

	const logOutHandler = () => {
		cookieMan.eraseCookie('token');
		navigate("/login");
	}

	return (
		<div>
			<button onClick={logOutHandler}>Log Out</button>
		</div>
	)
}

export default Home;