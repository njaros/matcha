export function isStringNotUndefinedOrEmpty(str: string): boolean
{
    return (str != undefined && str != "")
}

/**
 * leaflet map can return a longitude out of the range [-180, 180]
 * which is incorrect for the Back-end, apply a modulo of 180 isn't
 * correct, so this function has to be created
 * @param lng a float
 * @returns a correct longitude format
 */
export function lngModulo(lng: number): number
{
    let sign = false;
    if (lng < 180 && lng > -180)
        return lng;
    if (lng < 0)
    {
        sign = true;
        lng *= -1;
    }
    lng = lng % 360;
    if (lng > 180)
    {
        if (sign)
            lng -= 180;
        else
            lng = 360 - lng;
        sign = !sign;
    }
    if (sign)
        lng *= -1;
    return lng;
}
