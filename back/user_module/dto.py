from functools import wraps
from validators import uuid
from flask import request, current_app


def user_profile_dto(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        current_app.logger.info(request.json["user_id"])
        kwargs["user_id"] = uuid.isUuid(request.json["user_id"])
        return f(*args, **kwargs)

    return decorated
