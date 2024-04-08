from validators import str, int
from functools import wraps
from flask import request


def signup_dto(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        kwargs["username"] = str.isString(request.form["username"],
                                          {"maxlen": 20,
                                           "minlen": 3,
                                           "no_sp_char": True})
        kwargs["password"] = str.isString(request.form["password"])
        kwargs["email"] = str.isString(request.form["email"], {"max": 50, "no_sp_char": True})
        kwargs["age"] = int.isStrInt(request.form["age"], {"min": 18, "max": 150})
        kwargs["gender"] = str.isString(request.form["gender"],
                                        {"allowed": ("man", "woman", "non-binary")})
        kwargs["preference"] = str.isString(request.form["preference"],
                                            {"allowed": ("man",
                                                         "woman",
                                                         "non-binay",
                                                         "man-woman",
                                                         "man-nb",
                                                         "woman-nb",
                                                         "all")})
        kwargs["biography"] = str.isString(request.form.get("biography"), {"max": 500})
        return f(*args, **kwargs)
    return decorated

