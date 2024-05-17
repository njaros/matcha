import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { storeGps, storeTimeout } from "../../tools/Stores";
import { cookieMan } from "../../tools/CookieMan";
import { As, Box, Icon, Text } from "@chakra-ui/react"
import { MdFavorite, MdSettings } from "react-icons/md"
import { ImExit } from "react-icons/im"
import { MdChat } from "react-icons/md";
import { ChatIcon, SettingsIcon } from "@chakra-ui/icons"
import { useEffect, useState } from "react";

const headerTextSize = {base: "14px", sm: "16px", md: "19px", lg: "22px", xl: "25px"}
const headerIconSize = {base: 8, sm: 10, md: 12, lg: 14, xl: 16}

const isTarget = (location: string, itemLocation: string) => location === itemLocation

interface IIconNavBar {
    url: string,
    icon: As | undefined,
    boxSize: any,
    isTarget: boolean
}
const IconNavBar = ({url, icon, boxSize, isTarget}: IIconNavBar) => {
    console.log(isTarget)
    const color = isTarget ? '#FFFFFF' : '#57595D'
    const iconBorder = isTarget ? '2px red solid' : ''
    return (
            <NavLink to={url} style={{display: 'flex', position: 'relative', padding: '15px 0'}}>
                {
                    iconBorder && <Box position={'absolute'} height={'4px'} width={'100%'} backgroundColor={'white'} borderRadius={'10px 10px 0 0px'} bottom={'0'}></Box>
                }
                <Icon as={icon} boxSize={boxSize} color={color}/>
        </NavLink>
    )
}
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

        <Box 
        className="iconUserLogged"
        display="flex"
        width={'60%'}
        backgroundColor={'#212328'}
        borderRadius={'40px'}
        flexDirection="row"
        justifyContent="space-evenly"
        alignItems={'center'}
        marginBottom={'10px'}
        padding={'0 5px '}
        >
        { props.logged ?
        <>
            <IconNavBar url="/swipe" icon={MdFavorite} boxSize={headerIconSize} isTarget={isTarget("/swipe", location.pathname)} />
            <IconNavBar url="/conversation" icon={MdChat} boxSize={headerIconSize} isTarget={isTarget("/conversation", location.pathname)} />
            <IconNavBar url="/settings" icon={MdSettings} boxSize={headerIconSize} isTarget={isTarget("/settings", location.pathname)} />
            <button onClick={logout} style={{display: 'flex'}}><Icon color={"#57595D"} as={ImExit} boxSize={headerIconSize}/></button>
        </>
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