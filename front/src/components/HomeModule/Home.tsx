import { tokenReader } from "../../tools/TokenReader";
import { storeRefresh, storeTimeout } from "../../tools/Stores";
import Axios from "../../tools/Caller";

const Home: React.FC = () => {
    const { refreshToken, updateRefreshToken } = storeRefresh();

	const test = () => {
        Axios.get("/test").then(
            response => {
                console.log(response);
            }
        ).catch(
            error => {
                console.log(error);
            }
        )
    }

	const readPayload = () => {
		console.log(tokenReader.readPayload(tokenReader.getToken()));
	}

	const readRefreshToken = () => {
		console.log(refreshToken);
	}

	return (
		<div>
			<button onClick={readPayload}>Read token</button>
			<button onClick={readRefreshToken}>Read Refresh Token</button>
			<button onClick={test}>test required_token button</button>
		</div>
	)
}

export default Home;