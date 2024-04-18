from error_status.error import BadRequestError
import re


class NotStrException(BadRequestError):
    def __init__(self):
        self.message = "This argument isn't a string"


class StrMaxlenException(BadRequestError):
    def __init__(self, maxlen):
        self.message = f"This string is too long, max len is {maxlen}"


class StrMinlenException(BadRequestError):
    def __init__(self, minlen):
        self.message = f"This string is too small, min len is {minlen}"


class StrForbiddenException(BadRequestError):
    def __init__(self, param):
        self.message = f'"{param}" is forbidden'


class StrAllowedException(BadRequestError):
    def __init__(self, param):
        self.message = f'"{param}" isn\'t allowed'


class StrForbiddenCharException(BadRequestError):
    def __init__(self, match):
        self.message = f"character {match.group()} is forbidden"


forbidden_chars = re.compile(r'[\x00-\x1F\x7F-\x9F&<>"/\'%]')


def isString(foo: any, req: dict[str, any] = {}):
    """Check if the foo argument is a string class,
    throwing an NotStrException if not.
    req (requirements) is a dictionnary.
    req options allows to control if the int to be correctly formatted.
    req options list:
    ["maxlen"]:      int => if len(foo) > maxlen, raise StrMaxlenException.
    ["minlen"]:      int => if len(foo) < minlen, raise StrMinlenException.
    ["forbidden"]: tuple => if foo in forbidden, raise StrForbiddenException.
    ["allowed"]:   tuple => if foo not in allowed, raise StrAllowedException.
    ["optionnal"]:  bool => if True and foo is None, does not raise.
    ["no_sp_char"]: bool => if True and the foo string contains special char,
    raise StrForbiddenCharException.
    if allowed field is set, all other req options are ignored.
    the foo parameter is returned at end of function.
    Exemple of use:
    a = 15
    isInt(a) raise NotStrException

    b = "hello"
    isInt(b, {"maxlen": 3}) raise StrMaxlenException

    c = "red"
    isInt(c, {"allowed": ("pouet", "", "rouge")}) raise IntAllowedException
    """
    if foo is None:
        if req.get("optionnal") is True:
            return None

    if type(foo) is not str:
        raise NotStrException

    maxlen = req.get("maxlen")
    minlen = req.get("minlen")
    forbidden = req.get("forbidden")
    allowed = req.get("allowed")
    if allowed is not None:
        if foo not in allowed:
            raise (StrAllowedException(foo))
        return foo
    if maxlen is not None:
        if len(foo) > maxlen:
            raise (StrMaxlenException(maxlen))
    if minlen is not None:
        if len(foo) < minlen:
            raise (StrMinlenException(minlen))
    if forbidden is not None:
        if foo in forbidden:
            raise (StrForbiddenException(foo))
    if req.get("no_sp_char") is True:
        fchar = forbidden_chars.search(foo)
        if fchar:
            raise (StrForbiddenCharException(fchar))
    return foo
