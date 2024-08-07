import { Box } from "@chakra-ui/react";
import { JwtPayload } from "jsonwebtoken";
import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { io } from 'socket.io-client';
import VoiceChat from "./components/ConversationModule/Call";
import Chatbox from "./components/ConversationModule/Chatbox";
import ChannelList from "./components/ConversationModule/channel";
import Layout from "./components/LayoutModules/Layout";
import Forgot from "./components/LoginModule/Forgot";
import Login from "./components/LoginModule/Login";
import NoMatch from "./components/NoMatch";
import ChangePassword from "./components/SettingsModule/ChangePassword";
import Filter from "./components/SettingsModule/FilterModule/Filter";
import Hobbies from "./components/SettingsModule/Hobbies";
import OtherProfile from "./components/SettingsModule/OtherProfile";
import Photo from "./components/SettingsModule/Photo";
import Profile from "./components/SettingsModule/Profile";
import Settings from "./components/SettingsModule/Settings";
import LikeList from "./components/SettingsModule/UserLists/LikeList";
import LikerList from "./components/SettingsModule/UserLists/LikerList";
import MatchList from "./components/SettingsModule/UserLists/MatchList";
import VisitorList from "./components/SettingsModule/UserLists/VisitorList";
import Signup from "./components/SignUpModule/SignUp";
import Swipe from "./components/SwipeModule/Swipe";
import Axios from "./tools/Caller";
import { cookieMan } from "./tools/CookieMan";
import { storeLog, storeMe, storeMsgCount, storeRoomList, storeSocket, storeTimeout } from "./tools/Stores";
import { getToken, tokenReader } from "./tools/TokenReader";

function App() {

	const [userId, setUserId] = useState("");
	const { socket, updateSocket } = storeSocket();
	const [ access, setAccess ] = useState<string>(tokenReader.getToken());
    const { refreshTokenTimeoutId, updateRefreshTimeout } = storeTimeout();
	const [ me, updateMe ] = storeMe(state => [state.me, state.updateMe]);
	const updateMsgCount = storeMsgCount(state => state.updateMsgCount);
    const roomList = storeRoomList(state => state.roomList);
	const { log, updateLog } = storeLog();

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
		if (log)
		{
			roomList?.forEach(elt => {
				get_unread_msg_count(elt.id)			
			});
		}
	})

	useEffect(() => {
		if (log)
		{
			const fetchMe = async () => {
				try {
					const res = await Axios.get('/user/get_me')
					updateMe(res.data)
				}
				catch (err){
					if (err)
						console.warn(err)
				}
			}
			fetchMe()
		}
	}, [log])
	
	useEffect(() => {
		const ip = process.env.HOST_URL;
		if (log && ip && !socket){
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
	},[userId, log])


	//START OF TOKEN MANAGEMENT

	const askNewTokens = () =>
	{
		Axios.get("/refresh", {withCredentials: true})
		.then(
			response => {
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
							console.warn("wrong tokens: ", error.response.data);
							break;
						default:
							console.warn("unhandled error: ", error);
					}
				}
				else
				{
					console.warn("server error: ", error)
				}
				cookieMan.eraseCookie("token");
				setAccess("");
				updateLog(false);
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
		if (log && access != "") {
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
						console.warn("token expired before asking a new one");
						updateLog(false);
					}
				}
				else {
					console.warn("no expiration date on token's payload");
					updateLog(false);
				}
			}
			else {
				console.warn("no payload extractable from this token");
				updateLog(false);
			}
		}

		return () => {
			clearTimeout(timeIdTmp);
		}
	}, [access, log])
	
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
					<Route element={ <Layout handleAccess={handleAccess} /> }>
						<Route path="/login" element={ log ? <Navigate to="/" /> : (<Login handleAccess={handleAccess} />) } />
						<Route path="/signUp" element={ log ? <Navigate to="/" /> : (<Signup />) } />
						<Route path="/forgot" element={ log ? <Navigate to="/" /> : (<Forgot />) } />
						<Route element={ log ? <Outlet /> : <Navigate to="/login" /> } >
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