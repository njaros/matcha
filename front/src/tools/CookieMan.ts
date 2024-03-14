function getCookie(key: string)
{
    let matched = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)")
    return matched ? matched.pop() : undefined;
}

function addCookie(key: string, value: string)
{
    document.cookie = key.concat('=', value);
}

function eraseCookie(key: string)
{
    document.cookie = key.concat('=');
}

export const cookieMan = {
    getCookie, addCookie, eraseCookie
}