import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { tokenReader } from "../../tools/TokenReader";
import { storeRefresh, storeTimeout } from "../../tools/Stores";
import { cookieMan } from "../../tools/CookieMan";

const Header = () => {
    const { refreshTokenTimeoutId, updateRefreshTimeout } = storeTimeout();
	const setRefreshToken = storeRefresh(state => state.updateRefreshToken);
    const navigate = useNavigate();
    const location = useLocation();

    
    const logout = () => {
		if (refreshTokenTimeoutId != undefined)
		{
			clearTimeout(refreshTokenTimeoutId);
			updateRefreshTimeout(undefined);
		}
		setRefreshToken("");
		cookieMan.eraseCookie('token');
		navigate("./login", { relative: "path" });
	}

    return (
    <div>
        <h1><NavLink to="/">MATCHOOOO</NavLink></h1>
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
    </div>
    );
}

export default Header;