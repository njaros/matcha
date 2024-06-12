import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { storeGps, storeTimeout, storeDisplayNavBool, storeMsgCount, storeRoomList, storeRoomInfo } from "../../tools/Stores";
import { cookieMan } from "../../tools/CookieMan";
import { As, Box, Icon, Text } from "@chakra-ui/react"
import { MdFavorite, MdHome, MdSettings } from "react-icons/md"
import { TbMessage, TbMessage2Heart } from "react-icons/tb";
import { ImExit } from "react-icons/im"
import { MdChat } from "react-icons/md";
import { ChatIcon, SettingsIcon } from "@chakra-ui/icons"
import { useEffect, useState } from "react";

const headerTextSize = {base: "14px", sm: "16px", md: "19px", lg: "22px", xl: "25px"}
const headerIconSize = {base: 8, sm: 10, md: 12, lg: 14, xl: 16}

const isTarget = (location: string, itemLocation: string) => location === itemLocation
const isTargetSettings = (itemLocation: string) => "/settings" == itemLocation.substring(0, 9)
                                                || "/other_profile" == itemLocation.substring(0, 14)

interface IIconNavBar {
    url: string,
    icon: As | undefined,
    boxSize: any,
    isTarget: boolean
}
const IconNavBar = ({url, icon, boxSize, isTarget}: IIconNavBar) => {
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
const Footer = (props: {
    logged: boolean,
    handleLog: (newState: boolean) => void,
    handleAccess: (newAccess: string) => void}) =>
{
    const { refreshTokenTimeoutId, updateRefreshTimeout } = storeTimeout();
    const navigate = useNavigate();
    const location = useLocation();
    const { gps, updateGps } = storeGps();
    const [ logoutClicked, setLogoutClicked] = useState<boolean>(false);
    const DisplayNavBool = storeDisplayNavBool(state => state.DisplayNavBool)
    const msgCount = storeMsgCount(state => state.msgCount)
    const roomList = storeRoomList(state => state.roomList)
    const [msgBool, setMsgBool] = useState<boolean>(false)
    const room = storeRoomInfo(state => state.roomInfo)

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
    
    useEffect(() => {
        let hasUnreadMessage = false;
      
        roomList?.forEach(elt => {
          if (msgCount[elt.id]?.count > 0) {
            hasUnreadMessage = true;
            return;
          }
        });      
        setMsgBool(hasUnreadMessage);
      }, [msgCount]);

    const route= ['/chatbox', `/chatbox/call/${room.id}`]
    const hidesOnRoute = route.includes(location.pathname)
    // console.log(location.pathname)
    // if (shouldHide)
    //   return null

    return (

        !hidesOnRoute && <Box
        className="iconUserLogged"
        display="flex"
        width={'60%'}
        backgroundColor={'#212328'}
        borderRadius={'40px'}
        flexDirection="row"
        justifyContent="space-evenly"
        alignItems={'center'}
        marginBottom={'10px'}
        padding={'0 10px '}
        >
        { props.logged &&
        <>
            <IconNavBar url="/" icon={MdFavorite} boxSize={headerIconSize} isTarget={isTarget("/", location.pathname)} />
            <IconNavBar url="/channel" icon={msgBool === false ? TbMessage : TbMessage2Heart} boxSize={headerIconSize} isTarget={isTarget("/channel", location.pathname)} />
            <IconNavBar url="/settings" icon={MdSettings} boxSize={headerIconSize} isTarget={isTargetSettings(location.pathname)} />
            <button onClick={logout} style={{display: 'flex'}}><Icon color={"#57595D"} as={ImExit} boxSize={headerIconSize}/></button>
        </>
        }
    </Box>
    );
}

export default Footer;