from validators import uuid
from functools import wraps
from flask import request


def like_dislike_dto(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        kwargs["target"] = uuid.isUuid(request.json["target"])
        return f(*args, **kwargs)

    return decorated
