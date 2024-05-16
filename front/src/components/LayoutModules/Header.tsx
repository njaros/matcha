import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { storeGps, storeTimeout } from "../../tools/Stores";
import { cookieMan } from "../../tools/CookieMan";
import { Box, Icon, Text } from "@chakra-ui/react"
import { MdFavorite } from "react-icons/md"
import { ImExit } from "react-icons/im"
import { FaBinoculars } from "react-icons/fa"
import { SettingsIcon } from "@chakra-ui/icons"
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
    const [ logoutClicked, setLogoutClicked] = useState<boolean>(false);
 
    const logout = () => {
        if (refreshTokenTimeoutId != undefined)
        {
            clearTimeout(refreshTokenTimeoutId);
            updateRefreshTimeout(undefined);
        }
        setLogoutClicked(!logoutClicked);
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
        else {
            updateGps(undefined);
        }
    }, [logoutClicked])

    return (
    <Box    display="flex"
            flexDirection="column"
            width="100%"
            marginBottom="3%">
        <Box    display="flex"
                justifyContent="center"
                margin="10%"
                fontSize="xxx-large">
            <Text fontSize={{ base: '24px', sm: '28px', md: '32px', lg: '40px', xl: '48px' }}><NavLink to="/">MATCHOOOOO</NavLink></Text>
        </Box>
            { props.logged ?
            <Box display="flex" flexDirection="row" justifyContent="space-evenly">
                <NavLink to="/swipe"><Icon as={FaBinoculars} color="pink.400" boxSize={8}/></NavLink>
                <NavLink to="/conversation"><Icon as={MdFavorite} color="pink.400" boxSize={8}/></NavLink>
                <NavLink to="/settings"><SettingsIcon color="pink.400" boxSize={8} /></NavLink>
                <button onClick={logout}><Icon as={ImExit} color="pink.400" boxSize={8}/></button>
            </Box>
            :
            <Box>
                {location.pathname == "/login" ?
                <NavLink to="/signup">Not registered ? Sign Up !</NavLink> :
                <NavLink to="/login">Already registered ? Log In !</NavLink>}
            </Box>}
    </Box>
    );
}

export default Header;