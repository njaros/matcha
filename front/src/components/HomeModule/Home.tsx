import { useNavigate } from "react-router-dom"
import { cookieMan } from "../../tools/CookieMan"
import { tokenReader } from "../../tools/TokenReader";
import { storeRefresh, storeTimeout } from "../../tools/Stores";

const Home: React.FC = () => {
	const navigate = useNavigate();
    const { refreshTokenTimeoutId, updateRefreshTimeout } = storeTimeout();
    const { refreshToken, updateRefreshToken } = storeRefresh();

	const logOutHandler = () => {
		clearTimeout(refreshTokenTimeoutId);
		updateRefreshTimeout(undefined);
		updateRefreshToken("");
		cookieMan.eraseCookie('token');
		navigate("/login");
	}

	const readPayload = () => {
		console.log(tokenReader.readPayload(tokenReader.getToken()));
	}

	const readRefreshToken = () => {
		console.log(refreshToken);
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