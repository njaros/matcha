import datetime

def years_old(date):
    """Return an int which is the age old of a date.
    The date must be a string validated by validators.isDate().
    """
    today = datetime.date.today()
    t_year = today.year
    t_month = today.month
    t_day = today.day

    d_year = int(date[0:4])
    d_month = int(date[5:7])
    d_day = int(date[8:10])

    if t_day < d_day:
        t_month -= 1
    if t_month < d_month:
        t_year -= 1
    return t_year - d_year
