from error_status.error import BadRequestError
from uuid import UUID


class NotUuidException(BadRequestError):
    def __init__(self):
        self.message = "This is not an Uuid"


def isUuid(foo: any, as_string=True, optionnal=False):
    """Check is the foo argument is an uuid,
    throwing a NotUuidException if not.
    Because an uuid can be ether a string class or an UUID class,
    set as_string parameter as True will check foo as a string,
    or set as_string False will check foo as a UUID class.
    as_string is True by default.
    if optionnal is True and foo is None, does not raise excetion.
    the foo parameter is returned at end of function.
    exemples of use:
    a = uuid.UUID1()
    isUuid(a) raise NotUuidException
    isUuid(a, false) is Ok

    b = "hello"
    isUuid(b) and (isUuid, false) raise NotUuidException

    c = '5af56ce4-f361-11ee-8b5b-5d2fef656932'
    isUuid(c) is Ok
    isUuid(c, false) raise NotUuidException
    """
    if foo is None:
        if optionnal is True:
            return None

    if (as_string is False):
        if (type(foo) is not UUID):
            raise (NotUuidException)
    else:
        if (type(foo) is not str):
            raise (NotUuidException)
        try:
            UUID(foo)
        except (ValueError):
            raise (NotUuidException)
    return foo
