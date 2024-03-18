import { JwtPayload } from "jsonwebtoken";
import * as jsrsasign from 'jsrsasign';
import { cookieMan } from "./CookieMan";

function getToken()
{
    return cookieMan.getCookie("token")
}

function readPayload(token: string | undefined)
{
    if (token == undefined)
        return undefined;
    try
    {
        let parseToken = jsrsasign.KJUR.jws.JWS.parse(token);
        return (parseToken.payloadObj);
    }
    catch (error)
    {
        console.log("unreadable token");
        return undefined;
    }
}

function isTokenValid(token: string | undefined)
{
    if (token == undefined)
        return false;
    let decodedToken: JwtPayload | undefined = readPayload(token);
    if (decodedToken == undefined ||
        ( decodedToken.exp !== undefined
        && decodedToken.exp < Date.now() / 1000))
        {
            return false;
        }
    return true;
}

function isLogged()
{
    return isTokenValid(getToken());
}

export const tokenReader = {
    getToken, readPayload, isTokenValid, isLogged
}