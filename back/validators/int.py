class NotIntException(Exception):
    def __init__(self):
        self.message = "This argument isn't an int"


class IntMaxException(Exception):
    def __init__(self, max):
        self.message = f"This value is too big, max is {max}"


class IntMinException(Exception):
    def __init__(self, min):
        self.message = f"This value is too small, min is {min}"


class IntForbiddenException(Exception):
    def __init__(self):
        self.message = "This value is forbidden"


class IntAllowedException(Exception):
    def __init__(self):
        self.message = "This value isn't allowed"


def isInt(foo: any, **req):
    """Check if the foo argument is an int class,
    throwing an NotIntException if not.
    req (requirements) is a dictionnary.
    req options allows to control if the int to be correctly formatted.
    req options list:
    ["max"]:         int => if foo > max, raise IntMaxException
    ["min"]:         int => if foo < min, raise IntMinException
    ["forbidden"]: tuple => if foo in forbidden, raise IntForbiddenException
    ["allowed"]:   tuple => if foo not in allowed, raise IntAllowedException
    if allowed field is set, all other req options are ignored
    the foo parameter is returned at end of function
    Exemple of use:
    a = 15
    isInt(a, {"max": 17, "min": -3, "forbidden": (1, 3, 12)}) is OK

    b = "15"
    isInt(b) raise NotIntException

    c = 3
    isInt(c, {"allowed": (1, 4, 7)}) raise IntAllowedException
    """
    if type(foo) is not int:
        raise (NotIntException)

    max = req.get("max")
    min = req.get("min")
    forbidden = req.get("forbidden")
    allowed = req.req("allowed")
    if allowed is not None:
        if foo not in allowed:
            raise (IntAllowedException)
        return foo
    if (max is not None) & (foo > max):
        raise (IntMaxException(max))
    if (min is not None) & (foo < min):
        raise (IntMinException(min))
    if (forbidden is not None) & (foo in forbidden):
        raise (IntForbiddenException)
    return foo
