function setCookie(name: string, value: string, options: any = {})
{
    options = {
        path: '/',
        ...options
    };
    
    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += '=' + optionValue;
        }
    }

    document.cookie = updatedCookie
}

function getCookie(key: string)
{
    let matched = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)")
    return matched ? matched.pop() : undefined;
}

function addCookie(key: string, value: string, options: any = {})
{
    setCookie(key, value, options)
}

function eraseCookie(key: string)
{
    setCookie(key, "", {
        "max_age": -1
    })
}

export const cookieMan = {
    getCookie, addCookie, eraseCookie
}