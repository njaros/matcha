import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { tokenReader } from "../../tools/TokenReader";
import { storeTimeout } from "../../tools/Stores";
import { cookieMan } from "../../tools/CookieMan";
import { Box } from "@chakra-ui/react"

const Header = () => {
    const { refreshTokenTimeoutId, updateRefreshTimeout } = storeTimeout();
    const navigate = useNavigate();
    const location = useLocation();
 
    const logout = () => {
		if (refreshTokenTimeoutId != undefined)
		{
			clearTimeout(refreshTokenTimeoutId);
			updateRefreshTimeout(undefined);
		}
		cookieMan.eraseCookie('token');
		navigate("./login", { relative: "path" });
	}

    return (
    <Box    display="flex"
            flexDirection="column"
            width="100%"
            margin="10%"
            padding="5%"
            borderRadius="lg">
        <Box    display="flex"
                justifyContent="center"
                margin="15%"
                fontSize="xxx-large">
            <h1><NavLink to="/">MATCHOOOO</NavLink></h1>
        </Box>
        <Box>
            { tokenReader.isLogged() ?
            <ul>
                <li><NavLink to="/profile">Profile</NavLink></li>
                <li><NavLink to="/swipe">Swipe</NavLink></li>
                <li><NavLink to="/conversation">Conversation</NavLink></li>
                <li><button onClick={logout}>Log Out</button></li>
            </ul> :
            <ul>
                {location.pathname == "/login" ?
                <NavLink to="/signup">Not registered ? Sign Up !</NavLink> :
                <NavLink to="/login">Already registered ? Log In !</NavLink>}
            </ul>}
        </Box>
    </Box>
    );
}

export default Header;