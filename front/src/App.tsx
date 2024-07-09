import { Box } from "@chakra-ui/react";
import { JwtPayload } from "jsonwebtoken";
import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { io } from 'socket.io-client';
import Layout from "./components/LayoutModules/Layout";
import Login from "./components/LoginModule/Login";
import Filter from "./components/SettingsModule/FilterModule/Filter";
import Hobbies from "./components/SettingsModule/Hobbies";
import OtherProfile from "./components/SettingsModule/OtherProfile";
import Photo from "./components/SettingsModule/Photo";
import Profile from "./components/SettingsModule/Profile";
import Settings from "./components/SettingsModule/Settings";
import LikeList from "./components/SettingsModule/UserLists/LikeList";
import MatchList from "./components/SettingsModule/UserLists/MatchList";
import VisitorList from "./components/SettingsModule/UserLists/VisitorList";
import Signup from "./components/SignUpModule/SignUp";
import Swipe from "./components/SwipeModule/Swipe";
import Axios from "./tools/Caller";
import { cookieMan } from "./tools/CookieMan";
import { storeMe, storeMsgCount, storeRoomList, storeSocket, storeTimeout } from "./tools/Stores";
import { getToken, tokenReader } from "./tools/TokenReader";
import ChannelList from "./components/ConversationModule/channel";
import Chatbox from "./components/ConversationModule/Chatbox";
import VoiceChat from "./components/ConversationModule/Call";
import { useLocalCameraStream } from "./components/ConversationModule/Call";
import Forgot from "./components/LoginModule/Forgot";
import ChangePassword from "./components/SettingsModule/ChangePassword";
import LikerList from "./components/SettingsModule/UserLists/LikerList";
import NoMatch from "./components/NoMatch";

function App() {

	const [userId, setUserId] = useState("")
	const { socket, updateSocket } = storeSocket()
	const [ logged, setLogged ] = useState<boolean>(tokenReader.isLogged())
	const [ access, setAccess ] = useState<string>(tokenReader.getToken());
    const { refreshTokenTimeoutId, updateRefreshTimeout } = storeTimeout();
	const [ me, updateMe ] = storeMe(state => [state.me, state.updateMe])
	const updateMsgCount = storeMsgCount(state => state.updateMsgCount)
    const roomList = storeRoomList(state => state.roomList)

	const getUserId = () => {
		setUserId(tokenReader.getAttrAsString(getToken(), "user_id"))
	}

	const get_unread_msg_count = async (room_id : string) => {
        
        try{
            const res = await Axios.post('/chat/get_unread_msg_count', {room_id: room_id})
            updateMsgCount(room_id, res.data.count)

        }
        catch(err){
            if(err)
                console.warn(err)
        }
    }

    useEffect(() => {
        socket?.on('msg_count', (data: any) => {
                get_unread_msg_count(data)
        })
        return (() => {
            socket?.off('msg_count')
        })
    }, [socket])

	useEffect(() => {
		roomList?.forEach(elt => {
			get_unread_msg_count(elt.id)			
		});
	})

	
	useEffect(() => {
		const fetchMe = async () => {
			try {
				const res = await Axios.get('/user/get_me')
				updateMe(res.data)
			}
			catch (err){
				if (err)
					console.log(err)
			}
		}
		fetchMe()
	}, [logged])
	
	useEffect(() => {
		const ip = process.env.HOST_URL;
		console.log("ip= ", ip);
		if (logged && ip){
			getUserId()
			if (!userId || userId.length <= 0)
				return
			updateSocket(io(ip, {
				path: "/socket.io",
				query: {
					token : getToken()
				}
			}))

		}
	},[userId, logged])


	//START OF TOKEN MANAGEMENT

	const askNewTokens = () =>
	{
		Axios.get("/refresh", {withCredentials: true})
		.then(
			response => {
				console.log(response);
				switch (response.status)
				{
					case 200:
						cookieMan.addCookie("token", response.data.access_token);
						setAccess(response.data.access_token);
						break;
				}
			}
		)
		.catch(
			error => {
				if (error.response)
				{
					switch (error.response.status)
					{
						case 400:
							console.log("wrong tokens: ", error.response.data);
							break;
						default:
							console.log("unhandled error: ", error);
					}
				}
				else
				{
					console.log("server error: ", error)
				}
				cookieMan.eraseCookie("token");
				setAccess("");
				setLogged(false);
			}
		)
	}	

	useEffect(() => {
		let msAccessLeft = 0;
        let accessExp: number | undefined;
        let accessPayload: JwtPayload | undefined;
		let timeIdTmp: NodeJS.Timeout | undefined;

        if (refreshTokenTimeoutId != undefined)
		{
			clearTimeout(refreshTokenTimeoutId);
            updateRefreshTimeout(undefined);
		}
		if (logged && access != "") {
			accessPayload = tokenReader.readPayload(access);
			if (accessPayload != undefined) {
				accessExp = accessPayload.exp;
				if (accessExp != undefined) {
					msAccessLeft = accessExp - Date.now() / 1000;
					if (msAccessLeft > 0) {
						timeIdTmp = setTimeout(askNewTokens,
							Math.max(0, msAccessLeft - 1) * 1000)
						updateRefreshTimeout(timeIdTmp)
					}
					else {
						console.log("token expired before asking a new one");
						setLogged(false);
					}
				}
				else {
					console.log("no expiration date on token's payload");
					setLogged(false);
				}
			}
			else {
				console.log("no payload extractable from this token");
				setLogged(false);
			}
		}
		else
		{	
			setLogged(false);
			console.log("no token");
		}
		
		return () => {
			clearTimeout(timeIdTmp);
		}
	}, [access, logged])

	const handleLog = (newState: boolean) => {
		setLogged(newState);
	}
	
	const handleAccess = (newAccess: string) => {
		setAccess(newAccess);
	}

	//END OF TOKEN MANAGEMENT

	return (
		<Box
			className="App"
			display="flex"
			flexDirection="column"
			height="100%"
			width="100%"
			fontFamily="roboto"
			>
			<BrowserRouter>
				<Routes>
					<Route element={ <Layout logged={logged} handleLog={handleLog} handleAccess={handleAccess} /> }>
						<Route path="/login" element={ getToken() !== "" ? <Navigate to="/" /> : (<Login handleAccess={handleAccess} />) } />
						<Route path="/signUp" element={ getToken() !== "" ? <Navigate to="/" /> : (<Signup />) } />
						<Route path="/forgot" element={ getToken() !== "" ? <Navigate to="/" /> : (<Forgot />) } />
						<Route element={ getToken() !== "" ? <Outlet /> : <Navigate to="/login" /> } >
							<Route path="/" element={ <Swipe/> } />
							<Route path="/settings" element={ <Outlet />}>
								<Route path="/settings/" element={ <Settings /> } />
								<Route path="/settings/photos" element={ <Photo />} />
								<Route path="/settings/profile" element={ <Profile />} />
								<Route path="/settings/change_password" element={ <ChangePassword /> } />
								<Route path="/settings/match_list" element={ <MatchList />}/>
								<Route path="/settings/liked_list" element={ <LikeList /> } />
								<Route path="/settings/liker_list" element={ <LikerList /> } />
								<Route path="/settings/visits_list" element={ <VisitorList/> } />
								<Route path="/settings/filter" element={ <Filter focus={true} /> } />
								<Route path="/settings/hobbies" element= { <Hobbies /> } />
							</Route>
							<Route path="/other_profile/:id" element={ <OtherProfile /> } />
							<Route path="/channel" element={ <ChannelList />} />
							<Route path="/chatbox" element={ <Chatbox />} />
							<Route path="/chatbox/call/:roomName" element={ <VoiceChat />} />
						</Route>
						<Route path="*" element={ <NoMatch /> } />
					</Route>
				</Routes>
			</BrowserRouter>
		</Box>
		)
}

export default App	