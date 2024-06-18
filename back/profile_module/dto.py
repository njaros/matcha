from flask import request, current_app
from functools import wraps
from .sql import count_photos_by_user_id as count, verify_pass
from error_status.error import BadRequestError, ForbiddenError
from validators import str, date, int
from tools import GPS_tools
import hashlib


def image_dto(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        kwargs["photo_count"] = count(kwargs["user"]["id"])
        place_left = 5 - kwargs["photo_count"]
        denied_files = []
        accepted_files = []
        files = request.files.getlist("file[]")
        for file in files:
            MIME_TYPE = None
            buffer: bytearray = file.read()
            file.close()
            secure = buffer[0:4]
            match secure:
                case b"\xff\xd8\xff\xe0":
                    MIME_TYPE = "image/jpeg"
                case b"\x89\x50\x4e\x47":
                    MIME_TYPE = "image/png"
                case b"\x47\x49\x46\x38":
                    MIME_TYPE = "image/gif"
            if MIME_TYPE is not None:
                if place_left > 0:
                    place_left -= 1
                    accepted_files.append((MIME_TYPE, file.filename, buffer))
                else:
                    denied_files.append(
                        {"filename": file.filename, "reason": "no space left"}
                    )
            else:
                denied_files.append(
                    {
                        "filename": file.filename,
                        "reason": "unhandled file type",
                    }
                )
        if len(accepted_files) == 0:
            if len(denied_files) == 0:
                raise (BadRequestError("no file"))
        kwargs["accepted"] = accepted_files
        kwargs["denied"] = denied_files
        return f(*args, **kwargs)

    return decorated


def bio_dto(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        kwargs["biography"] = str.isString(
            request.form["biography"], {"maxlen": 500}
        )
        return f(*args, **kwargs)

    return decorated


def update_user_dto(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        kwargs["username"] = str.isString(
            request.form.get("username"),
            {"maxlen": 20, "minlen": 3, "no_sp_char": True, "optionnal": True},
        )
        kwargs["email"] = str.isString(
            request.form.get("email"), {"optionnal": True}
        )
        kwargs["birthDate"] = date.isDate(
            request.form.get("birthDate"),
            {"optionnal": True, "yearMin": 18, "yearMax": 150},
        )
        kwargs["gender"] = str.isString(
            request.form.get("gender"),
            {"optionnal": True, "allowed": ("man", "woman", "non-binary")},
        )
        kwargs["biography"] = str.isString(
            request.form.get("biography"), {"optionnal": True, "maxlen": 500}
        )
        kwargs["preference"] = str.isString(
            request.form.get("preference"),
            {
                "optionnal": True,
                "allowed": (
                    "man",
                    "woman",
                    "all",
                ),
            },
        )
        return f(*args, **kwargs)

    return decorated


def change_password_dto(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        kwargs["currentPassword"] = hashlib.sha256(
            str.isString(request.json["currentPassword"]).encode("utf-8")
        ).hexdigest()
        if verify_pass(**kwargs):
            kwargs["newPassword"] = hashlib.sha256(
                str.isString(request.json["newPassword"]).encode("utf-8")
            ).hexdigest()
            return f(*args, **kwargs)
        raise ForbiddenError("Wrong password !!")

    return decorated


def set_pos_dto(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        latitude = request.get_json()["latitude"]
        longitude = request.get_json()["longitude"]
        kwargs["gps"] = GPS_tools.Gps(latitude, longitude)
        current_app.logger.info(kwargs["gps"])
        return f(*args, **kwargs)

    return decorated


def add_hobby_dto(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        current_app.logger.info(request.json)
        kwargs["hobbie_ids"] = (int.isStrInt(request.json["id"], {"min": 0}),)
        current_app.logger.info(kwargs)
        return f(*args, **kwargs)

    return decorated


def del_hobby_dto(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        kwargs["hobbie_ids"] = (int.isStrInt(request.json["id"], {"min": 0}),)
        return f(*args, **kwargs)

    return decorated
