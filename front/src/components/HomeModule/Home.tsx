import { useNavigate } from "react-router-dom"
import { cookieMan } from "../../tools/CookieMan"
import { tokenReader } from "../../tools/TokenReader";
import { store } from "../../tools/Stores";

const Home: React.FC = () => {
	const navigate = useNavigate();
	const getRefreshToken = store((state) => state.refreshToken);

	const logOutHandler = () => {
		cookieMan.eraseCookie('token');
		navigate("/login");
	}

	const readPayload = () => {
		console.log(tokenReader.readPayload(tokenReader.getToken()));
	}

	const readRefreshToken = () => {
		console.log(getRefreshToken);
	}

	return (
		<div>
			<button onClick={logOutHandler}>Log Out</button>
			<button onClick={readPayload}>Read token</button>
			<button onClick={readRefreshToken}>Read Refresh Token</button>
		</div>
	)
}

export default Home;