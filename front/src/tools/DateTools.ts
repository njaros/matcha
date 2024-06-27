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
 * @param dateISOString a date to a format toISOstring
 * @returns a string describing time ellapsed between dateISOString param and now
 */
function lastConnectionFormat(dateISOString: string): string
{
    let msg = "last connection: "
    const sMs = 1000;
    const minMs = 60 * sMs;
    const hMs = 60 * minMs;
    const dMs = hMs * 24;
    const mMs = dMs * 30;
    const yMs = (mMs * 12) + 5;

    const now = new Date();
    const date = new Date(dateISOString);
    const ellapsed = now - date;
    console.log(ellapsed);

    const yEllapsed = Math.floor(ellapsed/yMs);
    if (yEllapsed > 0)
        return msg + yEllapsed + " years";
    const mEllapsed = Math.floor(ellapsed/mMs);
    if (mEllapsed > 0)
        return msg + mEllapsed + " months";
    const dEllapsed = Math.floor(ellapsed/dMs);
    if (dEllapsed > 0)
        return msg + dEllapsed + " days";
    const hEllapsed = Math.floor(ellapsed/hMs);
    if (hEllapsed > 0)
        return msg + hEllapsed + " hours";
    const minEllapsed = Math.floor(ellapsed/minMs);
    if (minEllapsed > 0)
        return msg + minEllapsed + " minutes";
    const sEllapsed = Math.floor(ellapsed/sMs);
    if (sEllapsed > 0)
        return msg + sEllapsed + " seconds";
    return msg + 0 + " second";
}

export const DateTools = {dateFromAge, ageFromDate, lastConnectionFormat}
