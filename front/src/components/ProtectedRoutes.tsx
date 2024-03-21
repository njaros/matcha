import { Navigate, Outlet, useLocation } from "react-router-dom"
import { tokenReader } from "../tools/TokenReader";
import React, { useEffect, useState } from "react";
import { storeRefresh, storeTimeout } from "../tools/Stores";
import { JwtPayload } from "jsonwebtoken";
import Axios from "../tools/Caller";
import { cookieMan } from "../tools/CookieMan";

//The rule of ProtectedRoutes is to wrap all the children routes
//by a token manager, and then devs never have to take care about token
//in the children modules content
const ProtectedRoutes: React.FC = () => {
	const location = useLocation();
    const [ access, setAccess ] = useState<string>(tokenReader.getToken());
    const { refreshToken, updateRefreshToken } = storeRefresh();
    const { refreshTokenTimeoutId, updateRefreshTimeout } = storeTimeout();

    const askNewTokens = () =>
    {
        let tokens = {
            access_token: access,
            refresh_token: refreshToken
        }
        Axios.post("/refresh", tokens)
        .then(
            response => {
                switch (response.status)
                {
                    case 200:
                        cookieMan.addCookie("token", response.data[0]);
                        updateRefreshToken(response.data[1]);
                        setAccess(response.data[0]);
                        updateRefreshToken(response.data[1]);
                        break;
                    default:
                        console.log("unhandled status: ", response.status);
                        console.log(response);
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
            }
        )
    }

	useEffect(() => {
		let msAccessLeft = 0;
        let msRefreshLeft = 0;
        let accessExp: number | undefined;
        let refreshExp: number | undefined;
        let accessPayload: JwtPayload | undefined;
		let refreshPayload: JwtPayload | undefined;
		let timeIdTmp: NodeJS.Timeout | undefined;

        if (refreshTokenTimeoutId != undefined)
		{
			clearTimeout(refreshTokenTimeoutId);
            updateRefreshTimeout(undefined);
		}
		if (access != "" && refreshToken != "") {
			accessPayload = tokenReader.readPayload(access);
			refreshPayload = tokenReader.readPayload(refreshToken);
			if (accessPayload != undefined && refreshPayload != undefined) {
				accessExp = accessPayload.exp;
				refreshExp = refreshPayload.exp;
				if (accessExp != undefined && refreshExp != undefined) {
					msAccessLeft = accessExp - Date.now() / 1000;
					msRefreshLeft = refreshExp - Date.now() / 1000;
					if (msAccessLeft > 0 && msRefreshLeft > 0) {
						timeIdTmp = setTimeout(askNewTokens,
							Math.max(0, Math.min(msAccessLeft - 1, msRefreshLeft - 1)) * 1000)
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

	return tokenReader.isLogged() ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
}

export default ProtectedRoutes;