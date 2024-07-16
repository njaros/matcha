from validators import str, date, gps
from functools import wraps
from flask import request, current_app as app
from jwt_policy.sql import get_user_by_id
from .sql import get_user_by_email
import jwt
from error_status.error import BadRequestError


def signup_dto(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        kwargs["username"] = str.isString(
            request.form["username"],
            {"maxlen": 20, "minlen": 3, "no_sp_char": True},
        )
        kwargs["password"] = str.isString(request.form["password"])
        kwargs["email"] = str.isEmail(request.form["email"])
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
        kwargs["email"] = str.isEmail(request.json["email"])
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


def mail_register_dto(f):
    @wraps(f)
    def decorated(token, *args, **kwargs):
        try:
            data = jwt.decode(
                token, app.config["SECRET_EMAIL_TOKEN"], algorithms=["HS256"]
            )
            expDate = data.get("exp")
            if expDate is None:
                raise BadRequestError("token expiration date is expired")
            kwargs["user"] = get_user_by_id(data["user_id"])
        except jwt.exceptions.InvalidTokenError:
            raise BadRequestError("Invalid Authentication token")
        return f(*args, **kwargs)

    return decorated


def reset_password_dto(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        kwargs["email"] = str.isEmail(request.json["email"])
        get_user_by_email(**kwargs)
        return f(*args, **kwargs)

    return decorated


def confirm_reset_password_dto(f):
    @wraps(f)
    def decorated(token, *args, **kwargs):
        try:
            data = jwt.decode(
                token,
                app.config["SECRET_RESET_PASSWORD"],
                algorithms=["HS256"],
            )
            expDate = data.get("exp")
            if expDate is None:
                raise BadRequestError("token expiration date is expired")
            kwargs["email"] = data["email"]
            kwargs["new_pass"] = data["new_pass"]
        except jwt.exceptions.InvalidTokenError:
            raise BadRequestError("Invalid Authentication token")
        return f(*args, **kwargs)

    return decorated
