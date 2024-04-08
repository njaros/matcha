from validators import str
from functools import wraps
from flask import request


def signup_dto(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        kwargs["username"] = str.isString(request.form["username"],
                                          {"maxlen": 20,
                                           "minlen": 3,
                                           "forbidden": ("aaaa", "bbb")})
        kwargs["password"] = str.isString(request.form["password"])
        kwargs["email"] = str.isString(request.form["email"])
        return f(*args, **kwargs)
    return decorated

