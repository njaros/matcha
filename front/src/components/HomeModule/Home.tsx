import { tokenReader } from "../../tools/TokenReader";
import { storeTimeout } from "../../tools/Stores";
import Axios from "../../tools/Caller";
import { Box } from "@chakra-ui/react";

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
		<Box flexGrow={1}>
			<button onClick={readPayload}>Read token</button>
			<button onClick={test}>test required_token button</button>
		</Box>
	)
}

export default Home;