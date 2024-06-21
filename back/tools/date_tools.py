import datetime


def years_old(date):
    """Return an int which is the age old of a date.
    The date must be a string validated by validators.isDate().
    """
    try:
        today = datetime.date.today()
        t_year = today.year
        t_month = today.month
        t_day = today.day

        # Split the date string by '-' to extract year, month, day
        parts = date.split('-')
        if len(parts) != 3:
            raise ValueError("Invalid date format. Expected 'YYYY-MM-DD'.")

        d_year = int(parts[0])
        d_month = int(parts[1])
        d_day = int(parts[2])

        if t_day < d_day:
            t_month -= 1
        if t_month < d_month:
            t_year -= 1
        return t_year - d_year
    except ValueError as e:
        print(f"Error processing date '{date}': {e}")
        return None
