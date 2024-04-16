import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom"
import { tokenReader } from "../tools/TokenReader";
import React, { useEffect, useState } from "react";
import { storeTimeout } from "../tools/Stores";
import { JwtPayload } from "jsonwebtoken";
import Axios from "../tools/Caller";
import { cookieMan } from "../tools/CookieMan";

//The rule of ProtectedRoutes is to wrap all the children routes
//by a token manager, and then devs never have to take care about token
//in the children modules content
const ProtectedRoutes: React.FC = () => {
	const location = useLocation();
    const navigate = useNavigate();
    const [ access, setAccess ] = useState<string>(tokenReader.getToken());
    const { refreshTokenTimeoutId, updateRefreshTimeout } = storeTimeout();

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
                navigate("./login", { relative: "path" });
            }
        )
    }

	useEffect(() => {
		let msAccessLeft = 0;
        let accessExp: number | undefined;
        let accessPayload: JwtPayload | undefined;
		let timeIdTmp: NodeJS.Timeout | undefined;

        //console.log("timeoutId = ", refreshTokenTimeoutId);
        if (refreshTokenTimeoutId != undefined)
		{
			clearTimeout(refreshTokenTimeoutId);
            updateRefreshTimeout(undefined);
		}
        //console.log("access = ", access);
		if (access != "") {
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
				}
			}
		}
		else
		{	
			console.log("no token");
		}
		
		return () => {
			console.log("useEffect of protected route returns");
			clearTimeout(timeIdTmp);
		}
	}, [access])

	return (tokenReader.isLogged() ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />)
}

export default ProtectedRoutes;