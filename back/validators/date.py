from error_status.error import BadRequestError
import re
import datetime
from tools import date_tools


class NotStrException(BadRequestError):
    def __init__(self):
        self.message = "the date input must be a string \
            formatted like \"yyyy-mm-dd\"."


class NotDateException(BadRequestError):
    def __init__(self, param):
        self.message = f"{param} is a bad date format, \
            it must be this format \"yyyy-mm-dd\"."


class NotValidDateException(BadRequestError):
    def __init__(self, param, errorMsg):
        self.message = f"{param} isn't a valid date because {errorMsg}"


class TooYoungException(BadRequestError):
    def __init__(self, age, min):
        self.message = f"minimum years old required is {min}, but yours is {age}"


class TooOldException(BadRequestError):
    def __init__(self, age, max):
        self.message = f"maximum years old possible is {max}, but yours is {age}"


def isDate(foo: any, req: dict[str, any]={}):
    """Check if the foo argument is a date string
    formated like this: foo = "yyyy-mm-dd".
    If not it raises a NotDateException.
    req optionnal parameter is a dictionnary which
    allows to set requirements to the date.
    req option list:
    ["optionnal"]: bool => if True and foo is None, does not raise
    ["yearMin"]: int => if the number of years between today and
                 the date is less than yearMin, it raises a
                 TooYoungException.
    ["yearMax"]: int => if the number of years between today and
                 the date is greater than yearMax, it raises a
                 TooOldException.
    ["min"]: int => if the number of day between today and the date
                 is less than min, it raises a DateTooShortException.
                 !!NOT IMPLEMENTED!!
    ["max"]: int => if the number of day between today and the date
                 is greater than max, it raises a DateTooLongException.
                 !!NOT IMPLEMENTED!!
    foo is returned at end of function.
    """
    if req.get("optionnal"):
        if foo is None:
            return None

    if type(foo) is not str:
        raise (NotStrException)
    
    if len(foo) != 10:
        raise (NotDateException(foo))
    
    rg = re.compile(r"""\d{4}\-\d{2}\-\d{2}""")
    m = rg.match(foo)
    if m is None:
        raise (NotDateException(foo))
    
    try:
        datetime.datetime(int(foo[0:4]), int(foo[5:7]), int(foo[8:10]))
    except ValueError as e:
        raise (NotValidDateException(foo, str(e)))

    yearMin = req.get("yearMin")
    yearMax = req.get("yearMax")
    age = None
    if yearMin is not None:
        age = date_tools.years_old(foo)
        if age < yearMin:
            raise TooYoungException(age, yearMin)
    if yearMax is not None:
        if age is None:
            age = date_tools.years_old(foo)
        if age > yearMax:
            raise TooOldException(age, yearMax)
    return foo
