import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { storeGps, storeTimeout } from "../../tools/Stores";
import { cookieMan } from "../../tools/CookieMan";
import { Box } from "@chakra-ui/react"
import { useEffect, useState } from "react";

const Header = (props: {
    logged: boolean,
    handleLog: (newState: boolean) => void,
    handleAccess: (newAccess: string) => void}) =>
{
    const { refreshTokenTimeoutId, updateRefreshTimeout } = storeTimeout();
    const navigate = useNavigate();
    const location = useLocation();
    const { gps, updateGps } = storeGps();
    const [ gpsError, setGpsError ] = useState<string | undefined>(undefined);
 
    const logout = () => {
        if (refreshTokenTimeoutId != undefined)
            {
                clearTimeout(refreshTokenTimeoutId);
                updateRefreshTimeout(undefined);
            }
        cookieMan.eraseCookie('token');
        props.handleLog(false);
        props.handleAccess("");
		navigate("./login", { relative: "path" });
	}

    function success(pos: GeolocationPosition) {
        var crd = pos.coords;
        console.log("your current position is: ");
        console.log(`Latitude : ${crd.latitude}`);
        console.log(`Longitude : ${crd.longitude}`);
        console.log(`More or less ${crd.accuracy} meters.`);
        updateGps(crd);
    }

    function error(err: GeolocationPositionError) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
        setGpsError(`couldn't get position: ${err.message}`);
    }

    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.permissions.query({name: "geolocation"}).then(function(result)
            {
                console.log(result);
                if (result.state == "granted" || result.state == "prompt")
                {
                    navigator.geolocation.getCurrentPosition(success, error, options);
                }
                else {
                    updateGps(undefined);
                }
            });
        }
        else {console.log("no geolocation in this Bowser");}
    }, [])

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
            { props.logged ?
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
            {gpsError != undefined && <Box>{gpsError}</Box>}
            {gps != undefined && <Box>Your position : latitude: {gps.latitude} longitude: {gps.longitude}</Box>}
        </Box>
    </Box>
    );
}

export default Header;