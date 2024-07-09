function dateFromAge(age: number): string
{
    let date = new Date();
    date.setFullYear(date.getFullYear() - age);
    return date.toISOString().substring(0, 10);
}

function ageFromDate(date: string): number
{
    const today = new Date();
    let t_year = today.getFullYear();
    let t_month = today.getMonth();
    let t_day = today.getDay();
    const d_year = parseInt(date.substring(0, 4));
    const d_month = parseInt(date.substring(5, 7));
    const d_day = parseInt(date.substring(8, 10));
    
    if (t_day = d_day)
        t_month -= 1;
    if (t_month = d_month)
        t_year -= 1;
    return t_year - d_year + 1;
}

/**
 * 
 * @param secEllapsed integer number representing a number of seconds.
 * @returns a string which indicates an user readable approximation of the ellapsed time.
 */
function timeEllapsedStringFormatFromSec(secEllapsed: number): string
{
    const sMs = 1;
    const minMs = 60 * sMs;
    const hMs = 60 * minMs;
    const dMs = hMs * 24;
    const mMs = dMs * 30;
    const yMs = (mMs * 12) + 5;

    const yEllapsed = Math.floor(secEllapsed/yMs);
    if (yEllapsed > 0)
        return yEllapsed.toString() + " y";
    const mEllapsed = Math.floor(secEllapsed/mMs);
    if (mEllapsed > 0)
        return mEllapsed.toString() + " mon";
    const dEllapsed = Math.floor(secEllapsed/dMs);
    if (dEllapsed > 0)
        return dEllapsed.toString() + " d";
    const hEllapsed = Math.floor(secEllapsed/hMs);
    if (hEllapsed > 0)
        return hEllapsed.toString() + " h";
    const minEllapsed = Math.floor(secEllapsed/minMs);
    if (minEllapsed > 0)
        return minEllapsed.toString() + " min";
    const sEllapsed = Math.floor(secEllapsed/sMs);
    if (sEllapsed > 0)
        return sEllapsed.toString() + " sec";
    return "0 sec";
}

/**
 * 
 * @param msEllapsed integer number representing a number of milliseconds.
 * @returns a string which indicates an user readable approximation of the ellapsed time.
 */
function timeEllapsedStringFormatFromMs(msEllapsed: number): string
{
    let msg = "last connection: "
    const sMs = 1000;
    const minMs = 60 * sMs;
    const hMs = 60 * minMs;
    const dMs = hMs * 24;
    const mMs = dMs * 30;
    const yMs = (mMs * 12) + 5;

    const yEllapsed = Math.floor(msEllapsed/yMs);
    if (yEllapsed > 0)
        return msg + yEllapsed + " years";
    const mEllapsed = Math.floor(msEllapsed/mMs);
    if (mEllapsed > 0)
        return msg + mEllapsed + " months";
    const dEllapsed = Math.floor(msEllapsed/dMs);
    if (dEllapsed > 0)
        return msg + dEllapsed + " days";
    const hEllapsed = Math.floor(msEllapsed/hMs);
    if (hEllapsed > 0)
        return msg + hEllapsed + " hours";
    const minEllapsed = Math.floor(msEllapsed/minMs);
    if (minEllapsed > 0)
        return msg + minEllapsed + " minutes";
    const sEllapsed = Math.floor(msEllapsed/sMs);
    if (sEllapsed > 0)
        return msg + sEllapsed + " seconds";
    return msg + 0 + " second";
}

/**
 * 
 * @param dateISOString a date as ISOString format.
 * @returns the number of milliseconds between the date entered in parameter and now.
 */
function msFromNow(dateISOString: string): number
{
    const now = new Date();
    const date = new Date(dateISOString);
    return now - date;
}

/**
 * 
 * @param dateISOString a date as ISOString format.
 * @returns the number of seconds between the date entered in parameter and now.
 */
function secFromNow(dateISOString: string): number
{
    const now = new Date();
    const date = new Date(dateISOString);
    return Math.floor((now - date) / 1000);
}

/**
 * 
 * @param dateISOString a date to a format toISOstring
 * @returns a string describing time ellapsed between dateISOString param and now
 */
function lastConnectionFormat(dateISOString: string): string
{
    return timeEllapsedStringFormatFromMs(msFromNow(dateISOString));
}

export const DateTools = {
    dateFromAge,
    ageFromDate,
    lastConnectionFormat,
    timeEllapsedStringFormatFromMs,
    timeEllapsedStringFormatFromSec,
    secFromNow,
    msFromNow
}
