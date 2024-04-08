from error_status.error import BadRequestError
import re


class NotStrException(BadRequestError):
    def __init__(self):
        self.message = "the date input must be a string \
            formatted like \"yyyy-mm-dd\"."


def isDate(foo: any, req: dict[str, any]={}):
    """Check if the foo argument is a date string
    formated like this: foo = "yyyy-mm-dd".
    If not it raises a NotDateException.
    req optionnal parameter is a dictionnary which
    allows to set requirements to the date.
    req option list:
    ["min"]: int => if the number of day between today and the date
                 is less than min, it raises a DateTooShortException.
    ["max"]: int => if the number of day between today and the date
                 is greater than max, it raises a DateTooLongException.
    ["yearMin"]: int => if the number of years between today and
                 the date is less than yearMin, it raises a
                 TooYoungException.
    ["yearMax"]: int => if the number of years between today and
                 the date is greater than yearMax, it raises a
                 TooOldException.
    foo is returned at en of function.
    """
    if type(foo) is not str:
        raise (NotStrException)
    
    #dateFormat = re.
    #years = foo[]
    return foo