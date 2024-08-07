import { JwtPayload } from "jsonwebtoken";
import * as jsrsasign from 'jsrsasign';
import { cookieMan } from "./CookieMan";

export function getToken()
{
	const token = cookieMan.getCookie("token")
    if (token === undefined)
        return ""
    return token
}

export function readPayload(token: string | undefined)
{
    if (token == undefined || token == "")
        return undefined;
    try
    {
        let parseToken = jsrsasign.KJUR.jws.JWS.parse(token);
        return (parseToken.payloadObj);
    }
    catch (error)
    {
        console.warn("unreadable token");
        return undefined;
    }
}

export function getAttr(token: string, attr: string): any
{
    let payload: JwtPayload | undefined = readPayload(token);
    if (payload == undefined)
        return payload;
    return payload[attr];
}

export function getAttrAsString(token: string, attr: string): string
{
    let val = getAttr(token, attr);
    if (typeof(val) == "string")
        return val;
    return "";
}

export function isTokenValid(token: string | undefined)
{
    if (token == undefined || token == "")
    {
        return false;
    }
    let decodedToken: JwtPayload | undefined = readPayload(token);
    if (decodedToken == undefined ||
        ( decodedToken.exp !== undefined
        && decodedToken.exp < Date.now() / 1000))
	{
        return false;
	}
    return true;
}

export function isLogged()
{
    return isTokenValid(getToken());
}

export const tokenReader = {
    getToken, readPayload, getAttr, getAttrAsString, isTokenValid, isLogged
}