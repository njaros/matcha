import { tokenReader } from "../../tools/TokenReader";
import { storeTimeout } from "../../tools/Stores";
import Axios from "../../tools/Caller";

const Home: React.FC = () => {

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

	return (
		<div>
			<button onClick={readPayload}>Read token</button>
			<button onClick={test}>test required_token button</button>
		</div>
	)
}

export default Home;