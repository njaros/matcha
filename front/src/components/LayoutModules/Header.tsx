import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { storeGps, storeTimeout } from "../../tools/Stores";
import { cookieMan } from "../../tools/CookieMan";
import { Box, Icon, Text } from "@chakra-ui/react"
import { MdFavorite } from "react-icons/md"
import { ImExit } from "react-icons/im"
import { MdChat } from "react-icons/md";
import { ChatIcon, SettingsIcon } from "@chakra-ui/icons"
import { useEffect, useState } from "react";

const headerTextSize = {base: "14px", sm: "16px", md: "19px", lg: "22px", xl: "25px"}
const headerIconSize = {base: 8, sm: 10, md: 12, lg: 14, xl: 16}

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
            <Text fontSize={{ base: '24px', sm: '28px', md: '32px', lg: '40px', xl: '48px' }}>
                <NavLink to="/">MATCHOOOOO</NavLink>
            </Text>
        </Box>
            { props.logged ?
            <Box className="iconUserLogged"
                display="flex"
                color="pink.400"
                flexDirection="row"
                justifyContent="space-evenly">
                <NavLink to="/swipe"><Icon as={MdFavorite} boxSize={headerIconSize}/></NavLink>
                <NavLink to="/conversation"><Icon as={MdChat} boxSize={headerIconSize}/></NavLink>
                <NavLink to="/settings"><SettingsIcon boxSize={headerIconSize}/></NavLink>
                <button onClick={logout}><Icon as={ImExit} boxSize={headerIconSize}/></button>
            </Box>
            :
            <Box className="signup_login" display="flex" justifyContent="center" fontSize={headerTextSize}>
                {location.pathname == "/login" ?
                <NavLink to="/signup">Not registered ? Sign Up !</NavLink> :
                <NavLink to="/login">Already registered ? Log In !</NavLink>}
            </Box>}
    </Box>
    );
}

export default Header;