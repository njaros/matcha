from error_status.error import BadRequestError
from flask import current_app


class NotStrException(BadRequestError):
    def __init__(self):
        self.message = "this argument must be a string type"


class NotStrIntException(BadRequestError):
    def __init__(self, param):
        self.message = (
            f"the argument {param} is not an int (must only contain digit)"
        )


class NotIntException(BadRequestError):
    def __init__(self):
        self.message = "This argument isn't an int"


class IntMaxException(BadRequestError):
    def __init__(self, max, param):
        self.message = f"value {param} is too big, max is {max}"


class IntMinException(BadRequestError):
    def __init__(self, min, param):
        self.message = f"value {param} is too small, min is {min}"


class IntForbiddenException(BadRequestError):
    def __init__(self, param):
        self.message = f"value {param} is forbidden"


class IntAllowedException(BadRequestError):
    def __init__(self, param):
        self.message = f"value {param} isn't allowed"


def isInt(foo: any, req: dict[str, any] = {}):
    """Check if the foo argument is an int class,
    throwing an NotIntException if not.
    req (requirements) is a dictionnary.
    req options allows to control if the int is correctly formatted.
    req options list:
    ["max"]:         int => if foo > max, raise IntMaxException.
    ["min"]:         int => if foo < min, raise IntMinException.
    ["forbidden"]: tuple => if foo in forbidden, raise IntForbiddenException.
    ["allowed"]:   tuple => if foo not in allowed, raise IntAllowedException.
    ["optionnal]:   bool => if true and foo is None, does not raise.
    if allowed field is set, all other req options are ignored.
    the foo parameter is returned at end of function.
    Exemple of use:
    a = 15
    isInt(a, {"max": 17, "min": -3, "forbidden": (1, 3, 12)}) is OK

    b = "15"
    isInt(b) raise NotIntException

    c = 3
    isInt(c, {"allowed": (1, 4, 7)}) raise IntAllowedException
    """
    if foo is None:
        if req.get("optionnal") is True:
            return None

    if type(foo) is not int:
        raise (NotIntException)

    max = req.get("max")
    min = req.get("min")
    forbidden = req.get("forbidden")
    allowed = req.get("allowed")
    if allowed is not None:
        if foo not in allowed:
            raise (IntAllowedException)
        return foo
    if max is not None:
        if foo > max:
            raise (IntMaxException(max))
    if min is not None:
        if foo < min:
            raise (IntMinException(min))
    if forbidden is not None:
        if foo in forbidden:
            raise (IntForbiddenException)
    return foo


def isStrInt(foo: any, req: dict[str, any] = {}):
    """Check if the foo argument is an str class and only
    composed by digit element, throwing NotStrException or NotStrIntException
    if not.
    req (requirements) is a dictionnary.
    req options allows to control if the int is correctly formatted.
    req options list:
    ["max"]:         int => if foo > max, raise IntMaxException.
    ["min"]:         int => if foo < min, raise IntMinException.
    ["forbidden"]: tuple => if foo in forbidden, raise IntForbiddenException.
    ["allowed"]:   tuple => if foo not in allowed, raise IntAllowedException.
    ["optionnal]:   bool => if true and foo is None, does not raise.
    if allowed field is set, all other req options are ignored.
    foo parameter is returned as an int at end of function.
    """
    if foo is None:
        if req.get("optionnal") is True:
            return None

    if type(foo) is not str:
        raise (NotStrException)
    try:
        nb = int(foo)
    except ValueError:
        raise (NotStrIntException(foo))

    max = req.get("max")
    min = req.get("min")
    forbidden = req.get("forbidden")
    allowed = req.get("allowed")
    if allowed is not None:
        if nb not in allowed:
            raise (IntAllowedException)
        return nb
    if max is not None:
        if nb > max:
            raise (IntMaxException(max, nb))
    if min is not None:
        if nb < min:
            raise (IntMinException(min, nb))
    if forbidden is not None:
        if nb in forbidden:
            raise (IntForbiddenException)
    return nb
