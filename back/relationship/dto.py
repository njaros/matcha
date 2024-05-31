from functools import wraps
from validators import uuid
from flask import request


def remove_like_dto(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        kwargs["user_id"] = uuid.isUuid(request.json["user_id"])
        return f(**kwargs)

    return decorated


def report_dto(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        kwargs["user_id"] = uuid.isUuid(request.json["user_id"])
        return f(**kwargs)

    return decorated
