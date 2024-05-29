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
            return 360 - lng;
        else
            return lng - 360
    }
    if (sign)
        lng *= -1;
    return lng;
}

/**
 * given an nominatim.openstreetmap location object
 * this function extract a decent location description
 * as a string.
 * @param location 
 * @returns 
 */
export function getPosInfo(location: any)
{
    if (location != null && location != undefined)
    {
        return location.city != undefined ?
        location.city :
        location.village != undefined ?
        location.village :
        location.town != undefined ?
        location.town :
        location.county != undefined ?
        location.county :
        location.state != undefined ?
        location.state : 
        location.country != undefined ?
        location.country : "";
    }
    return "";
}