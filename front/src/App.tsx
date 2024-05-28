import { Routes, Route, BrowserRouter, Navigate, Outlet } from "react-router-dom";
import Layout from "./components/LayoutModules/Layout";
import { tokenReader, getToken} from "./tools/TokenReader";
import { useEffect, useState } from "react";
import { Socket, io } from 'socket.io-client';
import { storeMe, storeSocket, storeTimeout } from "./tools/Stores";
import Login from "./components/LoginModule/Login";
import Signup from "./components/SignUpModule/SignUp";
import Home from "./components/HomeModule/Home";
import Conversation from "./components/ConversationModule/Conversation";
import Swipe from "./components/SwipeModule/Swipe";
import { ChakraProvider, Box } from "@chakra-ui/react"
import Axios from "./tools/Caller";
import { cookieMan } from "./tools/CookieMan";
import { JwtPayload } from "jsonwebtoken";
import Settings from "./components/SettingsModule/Settings";
import Photo from "./components/SettingsModule/Photo";
import Profile from "./components/SettingsModule/Profile";
import Geoloc from "./components/SettingsModule/FilterModule/Geoloc";
import Filter from "./components/SettingsModule/FilterModule/Filter";
import Hobbies from "./components/SettingsModule/Hobbies";

function App() {

	// const [socket, setSocket] = useState<Socket>(null)
	const [userId, setUserId] = useState("")
	const { socket, updateSocket } = storeSocket()
	const [ logged, setLogged ] = useState<boolean>(tokenReader.isLogged())
	const [ access, setAccess ] = useState<string>(tokenReader.getToken());
    const { refreshTokenTimeoutId, updateRefreshTimeout } = storeTimeout();
	const [ me, updateMe ] = storeMe(state => [state.me, state.updateMe])

	const getUserId = () => {
		setUserId(tokenReader.getAttrAsString(getToken(), "user_id"))
	}

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

		getUserId()
		console.log('userId: ', userId)
		if (!userId || userId.length <= 0)
			return
		console.log('test')
		updateSocket(io(`http://127.0.0.1:5066`, {
			query : {
				userId : userId,
				token : getToken()
			}
		}))

	},[userId]) 


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
			console.log("useEffect of app returns");
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
			display="flex"
			bg="pink.300"
			flexDirection="column"
			height="100%"
			width="100%"
			fontFamily="roboto"
			>
					<BrowserRouter>
						<Routes>
							<Route element={ <Layout logged={logged} handleLog={handleLog} handleAccess={handleAccess} /> }>
								<Route path="/login" element={ logged ? <Navigate to="/" /> : (<Login handleLog={handleLog} handleAccess={handleAccess} />) } />
								<Route path="/signUp" element={ logged ? <Navigate to="/" /> : (<Signup />) } />
								<Route element={ logged ? <Outlet /> : <Navigate to="/login" /> } >
									<Route path="/" element={ <Home />} />
									<Route path="/settings" element={ <Settings />}>
										<Route path="/settings/photos" element={ <Photo />}/>
										<Route path="/settings/profile" element={ <Profile />}/>
										<Route path="/settings/match_list" />
										<Route path="/settings/liked_list" />
										<Route path="/settings/visits_list" />
										<Route path="/settings/filter" element={ <Filter focus={true} /> } />
										<Route path="/settings/hobbies" element= { <Hobbies /> } />
									</Route>
									<Route path="/conversation" element={ <Conversation />} />
									<Route path="/swipe" element={ <Swipe/> } />
								</Route>
							</Route>
						</Routes>
					</BrowserRouter>
		</Box>
		)
}

export default App	