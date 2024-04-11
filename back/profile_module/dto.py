from flask import request, jsonify, current_app as app
from functools import wraps
from .sql import count_photos_by_user_id as count
from error_status.error import *
from validators import str


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
                case b'\xff\xd8\xff\xe0': MIME_TYPE = "image/jpeg"
                case b'\x89\x50\x4e\x47': MIME_TYPE = "image/png"
                case b'\x47\x49\x46\x38': MIME_TYPE = "image/gif"
            if MIME_TYPE is not None:
                if place_left > 0:
                    place_left -= 1
                    accepted_files.append((MIME_TYPE, file.filename, buffer))
                else:
                    denied_files.append({"filename": file.filename,
                                         "reason": "no space left"})
            else:
                denied_files.append({"filename": file.filename,
                                     "reason": "unhandled file type"})
        if len(accepted_files) == 0:
            if len(denied_files) == 0:
                raise(BadRequestError("no file"))
        kwargs["accepted"] = accepted_files
        kwargs["denied"] = denied_files
        return f(*args, **kwargs)
    return decorated


def bio_dto(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        kwargs["biography"] = str.isString(request.form["biography"], {"maxlen": 500})
        return f(*args, **kwargs)
    return decorated
