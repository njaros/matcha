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

export const DateTools = {dateFromAge, ageFromDate}
