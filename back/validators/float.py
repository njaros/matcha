from error_status.error import BadRequestError


class NotStrException(BadRequestError):
    def __init__(self):
        self.message = "this argument must be a string type"


class NotStrFloatException(BadRequestError):
    def __init__(self, param):
        self.message = (
            f"the argument {param} is not convertable to a float"
        )


class NotFloatException(BadRequestError):
    def __init__(self):
        self.message = "This argument isn't a float"


class FloatMaxException(BadRequestError):
    def __init__(self, max, param):
        self.message = f"value {param} is too big, max is {max}"


class FloatMinException(BadRequestError):
    def __init__(self, min, param):
        self.message = f"value {param} is too small, min is {min}"


class FloatForbiddenException(BadRequestError):
    def __init__(self, param):
        self.message = f"value {param} is forbidden"


class FloatAllowedException(BadRequestError):
    def __init__(self, param):
        self.message = f"value {param} isn't allowed"


def isFloat(foo: any, req: dict[str, any] = {}):
    """Check if the foo argument is an float class,
    throwing an NotfloatException if not.
    req (requirements) is a dictionnary.
    req options allows to control if the float is correctly formatted.
    req options list:
    ["max"]:       float => if foo > max, raise FloatMaxException.
    ["min"]:       float => if foo < min, raise FloatMinException.
    ["forbidden"]: tuple => if foo in forbidden, raise FloatForbiddenException.
    ["allowed"]:   tuple => if foo not in allowed, raise FloatAllowedException.
    ["optionnal]:   bool => if true and foo is None, does not raise.
    if allowed field is set, all other req options are ignored.
    the foo parameter is returned at end of function.
    Exemple of use:
    a = 15.4
    isFloat(a, {"max": 17.1, "min": -3, "forbidden": (1, 3.7, 15.39)}) is OK

    b = "15.1"
    isFloat(b) raise NotFloatException

    c = 3.7
    isFloat(c, {"allowed": (1.1, 4.4, 7)}) raise FloatAllowedException
    """
    if foo is None:
        if req.get("optionnal") is True:
            return None

    if type(foo) is not float:
        raise (NotFloatException)

    max = req.get("max")
    min = req.get("min")
    forbidden = req.get("forbidden")
    allowed = req.get("allowed")
    if allowed is not None:
        if foo not in allowed:
            raise (FloatAllowedException)
        return foo
    if max is not None:
        if foo > max:
            raise (FloatMaxException(max))
    if min is not None:
        if foo < min:
            raise (FloatMinException(min))
    if forbidden is not None:
        if foo in forbidden:
            raise (FloatForbiddenException)
    return foo


def isStrFloat(foo: any, req: dict[str, any] = {}):
    """Check if the foo argument is an str class and only
    composed by digit element with a dot or not, throwing NotFloatException
    or NotFloatfloatException if not.
    req (requirements) is a dictionnary.
    req options allows to control if the float to be correctly formatted.
    req options list:
    ["max"]:       float => if foo > max, raise floatMaxException.
    ["min"]:       float => if foo < min, raise floatMinException.
    ["forbidden"]: tuple => if foo in forbidden, raise floatForbiddenException.
    ["allowed"]:   tuple => if foo not in allowed, raise floatAllowedException.
    ["optionnal]:   bool => if true and foo is None, does not raise.
    if allowed field is set, all other req options are ignored.
    foo parameter is returned as an float at end of function.
    """
    if foo is None:
        if req.get("optionnal") is True:
            return None

    if type(foo) is not str:
        raise (NotStrException)
    try:
        nb = float(foo)
    except ValueError:
        raise (NotStrFloatException(foo))

    max = req.get("max")
    min = req.get("min")
    forbidden = req.get("forbidden")
    allowed = req.get("allowed")
    if allowed is not None:
        if nb not in allowed:
            raise (FloatAllowedException)
        return nb
    if max is not None:
        if nb > max:
            raise (FloatMaxException(max, nb))
    if min is not None:
        if nb < min:
            raise (FloatMinException(min, nb))
    if forbidden is not None:
        if nb in forbidden:
            raise (FloatForbiddenException)
    return nb
