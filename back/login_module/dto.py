from validators import str, int, date
from functools import wraps
from flask import request, current_app as app


def signup_dto(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        kwargs["username"] = str.isString(request.form["username"],
                                          {"maxlen": 20,
                                           "minlen": 3,
                                           "no_sp_char": True})
        kwargs["password"] = str.isString(request.form["password"])
        kwargs["email"] = str.isString(request.form["email"], {"max": 50, "no_sp_char": True})
        kwargs["birthDate"] = date.isDate(request.form["birthDate"], {"yearMin": 18, "yearMax": 150})
        kwargs["gender"] = str.isString(request.form["gender"],
                                        {"allowed": ("man", "woman", "non-binary")})
        kwargs["preference"] = str.isString(request.form["preference"],
                                            {"allowed": ("man",
                                                         "woman",
                                                         "non-binary",
                                                         "man-woman",
                                                         "man-nb",
                                                         "woman-nb",
                                                         "all")})
        kwargs["biography"] = str.isString(request.form.get("biography"), {"max": 500, "optionnal": True})
        return f(*args, **kwargs)
    return decorated


def login_dto(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        app.logger.info("FEGESGOISBGISEHFGIUF")
        app.logger.info(request.json)
        kwargs["username"] = str.isString(request.json["username"],
                                          {"maxlen": 20,
                                           "minlen": 3,
                                           "no_sp_char": True})
        kwargs["password"] = str.isString(request.json["password"])
        return f(*args, **kwargs)
    return decorated