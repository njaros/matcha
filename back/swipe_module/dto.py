from validators import uuid, date, int
from functools import wraps
from flask import request


def like_dislike_dto(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        kwargs["target_id"] = uuid.isUuid(request.json["target_id"])
        return f(*args, **kwargs)

    return decorated


def filter_swipe_dto(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        kwargs["date_min"] = date.isDate(request.json["date_min"])
        kwargs["date_max"] = date.isDate(
            request.json["date_max"], {"min": kwargs["date_min"]}
        )
        kwargs["distance_max"] = int.isInt(
            request.json["distance_max", {"min": 0}]
        )
        kwargs["hobby_ids"] = [
            uuid.isUuid(elt) for elt in request.json["hobby_ids"]
        ]
        kwargs["ranking_gap"] = int.isInt(
            request.json["ranking_gap"], {"min": 0, "max": 10}
        )
        return f(*args, **kwargs)

    return decorated
