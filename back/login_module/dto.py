from validators import str, date, gps
from functools import wraps
from flask import request, current_app


def signup_dto(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        kwargs["username"] = str.isString(
            request.form["username"],
            {"maxlen": 20, "minlen": 3, "no_sp_char": True},
        )
        kwargs["password"] = str.isString(request.form["password"])
        kwargs["email"] = str.isString(
            request.form["email"], {"max": 50, "no_sp_char": True}
        )
        kwargs["birthDate"] = date.isDate(
            request.form["birthDate"], {"yearMin": 18, "yearMax": 150}
        )
        kwargs["gender"] = str.isString(
            request.form["gender"], {"allowed": ("man", "woman", "non-binary")}
        )
        kwargs["preference"] = str.isString(
            request.form["preference"],
            {
                "allowed": (
                    "man",
                    "woman",
                    "non-binary",
                    "man-woman",
                    "man-nb",
                    "woman-nb",
                    "all",
                )
            },
        )
        kwargs["biography"] = str.isString(
            request.form.get("biography"), {"max": 500, "optionnal": True}
        )
        return f(*args, **kwargs)

    return decorated


def login_dto(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        kwargs["username"] = str.isString(
            request.json["username"],
            {"maxlen": 20, "minlen": 3, "no_sp_char": True},
        )
        kwargs["password"] = str.isString(request.json["password"])
        kwargs["latitude"] = gps.isLatitude(
            request.json.get("latitude"), {"optionnal": True}
        )
        if kwargs["latitude"] is None:
            kwargs["longitude"] = None
        else:
            kwargs["longitude"] = gps.isLongitude(
                request.json.get("longitude"), {"optionnal": True}
            )
            if kwargs["longitude"] is None:
                kwargs["latitude"] = None
        return f(*args, **kwargs)

    return decorated
